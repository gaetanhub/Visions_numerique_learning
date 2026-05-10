import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = new URL('..', import.meta.url);
const rootPath = fileURLToPath(root);
const baseUrl = process.env.VISION_NUMERIQUE_URL || 'http://127.0.0.1:5173';
const chromePath = process.env.CHROME_PATH || findChrome();
const outputDir = process.env.SCREENSHOT_DIR || path.join(os.tmpdir(), 'vision-numerique-lab-screens');

const routes = [
  'frequences-spatiales',
  'convolution-correlation-kernel',
  'gradient-sobel-bruit',
  'filtrage-frequentiel',
  'erosion-dilatation',
  'hough-accumulateur-votes',
];

const viewports = [
  { name: 'desktop', width: 1360, height: 960 },
  { name: 'mobile', width: 390, height: 844 },
];

if (!chromePath) {
  console.error('Chrome executable not found. Set CHROME_PATH to capture screenshots.');
  process.exit(1);
}

let devServer;
let chrome;
let profileDir;

try {
  if (!(await isReachable(baseUrl))) {
    const command = process.platform === 'win32' ? 'cmd.exe' : 'npm';
    const args = process.platform === 'win32'
      ? ['/d', '/s', '/c', 'npm run dev -- --host 127.0.0.1']
      : ['run', 'dev', '--', '--host', '127.0.0.1'];
    devServer = spawn(command, args, {
      cwd: rootPath,
      shell: false,
      stdio: 'ignore',
    });
    await waitForUrl(baseUrl, 15000);
  }

  mkdirSync(outputDir, { recursive: true });
  profileDir = mkdtempSync(path.join(os.tmpdir(), 'vision-capture-cdp-'));
  const remotePort = 9700 + Math.floor(Math.random() * 400);
  chrome = spawn(chromePath, [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--disable-crash-reporter',
    '--no-first-run',
    `--remote-debugging-port=${remotePort}`,
    `--user-data-dir=${profileDir}`,
    'about:blank',
  ], { stdio: 'ignore' });

  const wsUrl = await waitForDebugWebSocket(remotePort);
  const client = await createCdpClient(wsUrl);
  const failures = [];
  const captures = [];

  for (const viewport of viewports) {
    await client.send('Emulation.setDeviceMetricsOverride', {
      width: viewport.width,
      height: viewport.height,
      deviceScaleFactor: viewport.name === 'mobile' ? 2 : 1,
      mobile: viewport.name === 'mobile',
    });
    for (const route of routes) {
      const url = `${baseUrl}/#${route}/lab`;
      await client.send('Page.navigate', { url });
      await waitForLabImages(client, 5000);
      const check = await client.evaluate(`(() => {
        const stage = document.querySelector('[data-lab-kind]');
        const images = [...document.querySelectorAll('.labVisualStage img')];
        const advancedFrame = document.querySelector('.advancedCourseFrame');
        const rect = stage?.getBoundingClientRect();
        return {
          hasStage: Boolean(stage),
          imageCount: images.length,
          imagesLoaded: images.every((img) => img.complete && img.naturalWidth > 0),
          bodyOverflow: document.documentElement.scrollWidth > window.innerWidth + 2,
          stageOverflow: stage ? stage.scrollWidth > stage.clientWidth + 2 : false,
          stageWidth: rect ? Math.round(rect.width) : 0,
          frameHeight: advancedFrame ? Math.round(advancedFrame.getBoundingClientRect().height) : 0,
          title: document.querySelector('h1')?.textContent || '',
        };
      })()`);
      await client.evaluate(`(() => {
        document.querySelector('.labVisualStage')?.scrollIntoView({ block: 'start' });
      })()`);
      await delay(250);
      if (!check.hasStage) failures.push(`Missing lab stage on ${viewport.name}/${route}`);
      if (check.imageCount < 1 || !check.imagesLoaded) failures.push(`Images not loaded on ${viewport.name}/${route}`);
      if (check.bodyOverflow) failures.push(`Horizontal overflow on ${viewport.name}/${route}`);
      if (check.stageOverflow) failures.push(`Lab stage overflow on ${viewport.name}/${route}`);
      if (check.frameHeight > (viewport.name === 'mobile' ? 280 : 340)) failures.push(`Course image too tall on ${viewport.name}/${route}: ${check.frameHeight}px`);

      const screenshot = await client.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
      const filename = `${viewport.name}-${route}.png`;
      const filePath = path.join(outputDir, filename);
      writeFileSync(filePath, Buffer.from(screenshot.result.data, 'base64'));
      captures.push(`${filename} (${check.stageWidth}px stage, ${check.frameHeight}px image)`);
    }
  }

  await client.close();

  if (failures.length > 0) {
    console.error(failures.join('\n'));
    process.exit(1);
  }

  console.log(`screenshots captured in ${outputDir}`);
  console.log(captures.join('\n'));
} finally {
  if (chrome && !chrome.killed) chrome.kill();
  if (devServer && !devServer.killed) devServer.kill();
  if (profileDir && existsSync(profileDir)) {
    try {
      rmSync(profileDir, { recursive: true, force: true, maxRetries: 3, retryDelay: 200 });
    } catch {
      // The browser profile can remain locked very briefly on Windows.
    }
  }
}

function findChrome() {
  const candidates = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
  ];
  return candidates.find((candidate) => existsSync(candidate));
}

function isReachable(url) {
  return new Promise((resolve) => {
    const request = http.get(url, { timeout: 1000 }, (response) => {
      response.resume();
      resolve(response.statusCode >= 200 && response.statusCode < 500);
    });
    request.on('error', () => resolve(false));
    request.on('timeout', () => {
      request.destroy();
      resolve(false);
    });
  });
}

async function waitForUrl(url, timeoutMs) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (await isReachable(url)) return;
    await delay(250);
  }
  throw new Error(`Timed out waiting for ${url}`);
}

function getJson(port, requestPath) {
  return new Promise((resolve, reject) => {
    const request = http.get({ hostname: '127.0.0.1', port, path: requestPath, timeout: 1000 }, (response) => {
      let data = '';
      response.on('data', (chunk) => { data += chunk; });
      response.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (error) {
          reject(error);
        }
      });
    });
    request.on('error', reject);
    request.on('timeout', () => request.destroy(new Error('timeout')));
  });
}

async function waitForDebugWebSocket(port) {
  const start = Date.now();
  while (Date.now() - start < 10000) {
    try {
      const pages = await getJson(port, '/json/list');
      const page = pages.find((item) => item.type === 'page');
      if (page?.webSocketDebuggerUrl) return page.webSocketDebuggerUrl;
    } catch {
      // retry
    }
    await delay(200);
  }
  throw new Error('Chrome DevTools endpoint unavailable');
}

async function createCdpClient(wsUrl) {
  const ws = new WebSocket(wsUrl);
  await new Promise((resolve, reject) => {
    ws.addEventListener('open', resolve, { once: true });
    ws.addEventListener('error', reject, { once: true });
  });

  let id = 0;
  const pending = new Map();
  ws.addEventListener('message', (event) => {
    const message = JSON.parse(event.data);
    if (pending.has(message.id)) {
      pending.get(message.id)(message);
      pending.delete(message.id);
    }
  });

  const send = (method, params = {}) => {
    const messageId = ++id;
    ws.send(JSON.stringify({ id: messageId, method, params }));
    return new Promise((resolve) => pending.set(messageId, resolve));
  };

  await send('Runtime.enable');
  await send('Page.enable');

  return {
    send,
    async evaluate(expression) {
      const response = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
      if (response.result?.exceptionDetails) {
        throw new Error(response.result.exceptionDetails.text || 'evaluation failed');
      }
      return response.result.result.value;
    },
    close() {
      ws.close();
    },
  };
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForLabImages(client, timeoutMs) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const ready = await client.evaluate(`(() => {
      const stage = document.querySelector('[data-lab-kind]');
      const images = [...document.querySelectorAll('.labVisualStage img')];
      return Boolean(stage) && images.length > 0 && images.every((img) => img.complete && img.naturalWidth > 0);
    })()`);
    if (ready) return;
    await delay(100);
  }
}
