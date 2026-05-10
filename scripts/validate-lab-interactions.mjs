import { spawn } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = new URL('..', import.meta.url);
const rootPath = fileURLToPath(root);
const appSource = readFileSync(new URL('../src/App.tsx', import.meta.url), 'utf8');
const dataSource = [
  readFileSync(new URL('../src/data/prototype.ts', import.meta.url), 'utf8'),
  readFileSync(new URL('../src/data/advancedChapters.ts', import.meta.url), 'utf8'),
].join('\n');

const labs = [
  { route: 'vision-humaine', kind: 'vision', parts: ['measure', 'context'] },
  { route: 'sources-images', kind: 'sources', parts: ['electromagnetic', 'medical-acoustic'] },
  { route: 'traitement-analyse', kind: 'pipeline', parts: ['processing', 'analysis'] },
  { route: 'definition-image', kind: 'pixels', parts: ['sampling', 'quantization', 'memory'] },
  { route: 'representation-couleur', kind: 'color', parts: ['channels', 'synthesis'] },
  { route: 'roi-resize-interpolation', kind: 'roi', parts: ['roi', 'resize', 'interpolation'] },
  { route: 'intensite-principes', kind: 'intensity-map', parts: ['function-t', 'bit-plane'] },
  { route: 'identite-inversion', kind: 'intensity-invert', parts: ['negative', 'threshold'] },
  { route: 'log-gamma', kind: 'intensity-gamma', parts: ['log', 'gamma'] },
  { route: 'histogrammes-intensite', kind: 'histogram', parts: ['histogram', 'cumulative'] },
  { route: 'normalisation-egalisation', kind: 'histogram-equalization', parts: ['normalize', 'equalize'] },
  { route: 'frequences-spatiales', kind: 'spatial-lowpass', parts: ['frequency', 'low-high', 'spectral'] },
  { route: 'convolution-correlation-kernel', kind: 'spatial-kernel', parts: ['kernel', 'padding', 'correlation'] },
  { route: 'lissage-passe-bas', kind: 'spatial-lowpass', parts: ['box', 'gaussian', 'median'] },
  { route: 'bilateral-preservation-contours', kind: 'spatial-lowpass', parts: ['spatial-weight', 'intensity-weight', 'edges'] },
  { route: 'passe-haut-transitions', kind: 'spatial-highpass', parts: ['transition', 'derivative', 'smoothing'] },
  { route: 'gradient-sobel-bruit', kind: 'spatial-highpass', parts: ['gradient', 'sobel', 'noise'] },
  { route: 'laplacien-log-highboost', kind: 'spatial-highpass', parts: ['laplacian', 'negative-values', 'log'] },
  { route: 'canny-contours', kind: 'spatial-highpass', parts: ['smooth-gradient', 'nms', 'hysteresis'] },
  { route: 'fourier-bases-frequences', kind: 'fourier', parts: ['sinusoids', 'amplitude-phase', 'spatial-frequency'] },
  { route: 'dft-fft-spectre', kind: 'fourier', parts: ['dft', 'fft', 'spectrum'] },
  { route: 'filtrage-frequentiel', kind: 'fourier', parts: ['transfer', 'lowpass', 'highpass'] },
  { route: 'aliasing-nyquist', kind: 'fourier', parts: ['sampling', 'aliasing', 'nyquist'] },
  { route: 'morphologie-elements-structurants', kind: 'morphology', parts: ['structuring', 'translation', 'task-choice'] },
  { route: 'erosion-dilatation', kind: 'morphology', parts: ['erosion', 'dilation', 'iterations'] },
  { route: 'ouverture-fermeture', kind: 'morphology', parts: ['opening', 'closing', 'duality'] },
  { route: 'gradient-morphologique-contours', kind: 'morphology', parts: ['internal', 'external', 'fingerprint'] },
  { route: 'hough-principe-formes', kind: 'hough', parts: ['forms', 'edges', 'robustness'] },
  { route: 'hough-parametres-polaires', kind: 'hough', parts: ['mc', 'polar', 'equation'] },
  { route: 'hough-accumulateur-votes', kind: 'hough', parts: ['votes', 'resolution', 'peaks'] },
  { route: 'hough-labo-lignes', kind: 'hough', parts: ['preprocess', 'accumulator', 'draw-lines'] },
];

const failures = [];

for (const marker of ['export type LabPart', 'parts: LabPart[]']) {
  if (!dataSource.includes(marker)) failures.push(`Missing lab parts model marker: ${marker}`);
}

for (const marker of ['data-lab-part-tabs', 'data-lab-part-id', 'data-primary-control']) {
  if (!appSource.includes(marker)) failures.push(`Missing lab interaction marker: ${marker}`);
}

for (const lab of labs) {
  if (!dataSource.includes(`id: '${lab.route}'`)) failures.push(`Missing lab module: ${lab.route}`);
  if (!dataSource.includes(`kind: '${lab.kind}'`)) failures.push(`Missing lab kind: ${lab.kind}`);
  for (const part of lab.parts) {
    if (!dataSource.includes(`id: '${part}'`) && !dataSource.includes(`part('${part}'`)) {
      failures.push(`Missing lab part id: ${lab.route}/${part}`);
    }
  }
}

if (failures.length > 0) {
  console.error(failures.join('\n'));
  process.exit(1);
}

const baseUrl = process.env.VISION_NUMERIQUE_URL || 'http://127.0.0.1:5173';
const chromePath = process.env.CHROME_PATH || findChrome();
if (!chromePath) {
  console.error('Chrome executable not found. Set CHROME_PATH to run interaction validation.');
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

  profileDir = mkdtempSync(path.join(os.tmpdir(), 'vision-lab-cdp-'));
  const remotePort = 9400 + Math.floor(Math.random() * 500);
  chrome = spawn(chromePath, [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--disable-crash-reporter',
    '--no-first-run',
    `--remote-debugging-port=${remotePort}`,
    `--user-data-dir=${profileDir}`,
    '--window-size=1360,960',
    'about:blank',
  ], { stdio: 'ignore' });

  const wsUrl = await waitForDebugWebSocket(remotePort);
  const client = await createCdpClient(wsUrl);
  const results = [];

  for (const lab of labs) {
    for (const part of lab.parts) {
      await client.send('Page.navigate', { url: `${baseUrl}/#${lab.route}/lab` });
      await delay(500);
      const result = await client.evaluate(interactionProbe(lab, part));
      results.push(result);
      if (!result.hasStage) failures.push(`Missing rendered stage: ${lab.route}/${part}`);
      if (!result.partActive) failures.push(`Part did not become active: ${lab.route}/${part}`);
      if (!result.imagesLoaded) failures.push(`Image not loaded: ${lab.route}/${part}`);
      if (result.primaryCount !== 1) failures.push(`Expected one primary control for ${lab.route}/${part}, found ${result.primaryCount}`);
      if (!result.changed) failures.push(`Primary control did not change visible output: ${lab.route}/${part}`);
    }
  }

  await client.close();

  if (failures.length > 0) {
    console.error(failures.join('\n'));
    process.exit(1);
  }

  console.log(`lab interaction validation passed (${results.length} lab parts checked)`);
} finally {
  if (chrome && !chrome.killed) chrome.kill();
  if (devServer && !devServer.killed) devServer.kill();
  if (profileDir && existsSync(profileDir)) {
    try {
      rmSync(profileDir, { recursive: true, force: true, maxRetries: 3, retryDelay: 200 });
    } catch {
      // Windows can keep Chrome's temporary profile locked for a short moment after headless shutdown.
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

function interactionProbe(lab, part) {
  return `(() => new Promise((resolve) => {
    const stage = document.querySelector('[data-lab-kind="${lab.kind}"]');
    const partButton = document.querySelector('[data-lab-part-id="${part}"]');
    if (partButton && !partButton.disabled) partButton.click();
    setTimeout(() => {
      const activePart = document.querySelector('[data-lab-part-id="${part}"][aria-pressed="true"]');
      const activeStage = document.querySelector('[data-lab-kind="${lab.kind}"]');
      const signature = () => activeStage ? [
        activeStage.innerText,
        ...[...activeStage.querySelectorAll('img')].map((img) => img.currentSrc + ':' + img.complete + ':' + img.naturalWidth),
        ...[...activeStage.querySelectorAll('.pixel,.roiPixel,.histogramBars > span,.curvePanel span,.rgbPreview,.processingPreview,.sourceDisplay,.spectrumBars > span,.kernelPixel,.kernelCell,.derivativeTrack span,.spectrumCell,.morphCell,.houghPoint,.houghLine,.accCell')].slice(0, 80).map((el) => getComputedStyle(el).backgroundColor + '/' + getComputedStyle(el).height + '/' + getComputedStyle(el).filter + '/' + getComputedStyle(el).transform),
      ].join('|') : '';
      const before = signature();
      const primaryControls = activeStage ? [...activeStage.querySelectorAll('[data-primary-control]')] : [];
      const primary = primaryControls[0];
      let action = false;
      if (primary) {
        const input = primary.querySelector('input:not([disabled])');
        const button = primary.querySelector('button:not([disabled])');
        if (input) {
          if (input.type === 'checkbox') {
            input.click();
            action = true;
          } else {
            const current = Number(input.value);
            const min = Number(input.min || 0);
            const max = Number(input.max || 100);
            const nextValue = String(Math.abs(current - min) > Math.abs(current - max) ? min : max);
            const valueSetter = Object.getOwnPropertyDescriptor(input.constructor.prototype, 'value')?.set;
            if (valueSetter) {
              valueSetter.call(input, nextValue);
            } else {
              input.value = nextValue;
            }
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));
            action = true;
          }
        } else if (button) {
          button.click();
          action = true;
        }
      }
      setTimeout(() => {
        const images = activeStage ? [...activeStage.querySelectorAll('img')] : [];
        const after = signature();
        resolve({
          route: '${lab.route}',
          kind: '${lab.kind}',
          part: '${part}',
          hasStage: Boolean(activeStage),
          partActive: Boolean(activePart),
          imagesLoaded: images.every((img) => img.complete && img.naturalWidth > 0),
          primaryCount: primaryControls.length,
          action,
          changed: action && before !== after,
        });
      }, 120);
    }, 120);
  }))()`;
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
