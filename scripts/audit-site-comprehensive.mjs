import { spawn } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = new URL('..', import.meta.url);
const rootPath = fileURLToPath(root);
const baseUrl = process.env.VISION_NUMERIQUE_URL || 'http://127.0.0.1:5173';
const chromePath = process.env.CHROME_PATH || findChrome();
const reportPath = process.env.AUDIT_REPORT || path.join(os.tmpdir(), 'vision-numerique-site-audit.json');
const sourceText = [
  readFileSync(new URL('../src/data/prototype.ts', import.meta.url), 'utf8'),
  readFileSync(new URL('../src/data/advancedChapters.ts', import.meta.url), 'utf8'),
].join('\n');

const sourceFiles = new Map([
  ['introduction.md', 'chapitre_01/introduction/introduction.md'],
  ['transformationIntensite.md', 'chapitre_02/transformationIntensite/transformationIntensite.md'],
  ['labo_02.md', 'chapitre_02/labo_02/labo_02.md'],
  ['filtrageSpatial_1.md', 'chapitre_03/filtrageSpatial_1/filtrageSpatial_1.md'],
  ['labo_03.md', 'chapitre_03/labo_03/labo_03.md'],
  ['filtrageSpatial_passehaut.md', 'chapitre_04/filtrageSpatial_passehaut/filtrageSpatial_passehaut.md'],
  ['labo_04.md', 'chapitre_04/labo_04/labo_04.md'],
  ['Fourier_domaine_frequenciel.md', 'chapitre_05/Fourier_domaine_frequenciel/Fourier_domaine_frequenciel.md'],
  ['labo_05.md', 'chapitre_05/labo_05/labo_05.md'],
  ['morphology.md', 'chapitre_06/morphology/morphology.md'],
  ['labo_06.md', 'chapitre_06/labo_06/labo_06.md'],
  ['transformation_de_hough.md', 'chapitre_07/transformation_de_hough/transformation_de_hough.md'],
  ['labo_07.md', 'chapitre_07/labo_07/labo_07.md'],
]);

const modules = extractModules(sourceText);
const failures = [];
const report = {
  checkedAt: new Date().toISOString(),
  modules: modules.map((module) => module.id),
  moduleCount: modules.length,
  routesChecked: 0,
  labPartsChecked: 0,
  reviewsChecked: 0,
  sourceFilesChecked: 0,
  failures,
};

if (!chromePath) {
  console.error('Chrome executable not found. Set CHROME_PATH to run the comprehensive audit.');
  process.exit(1);
}

if (modules.length !== 31) {
  failures.push(`Expected 31 modules, found ${modules.length}.`);
}

for (const module of modules) {
  if (!module.sourceFile) failures.push(`Missing source file marker for ${module.id}`);
  if (!module.sourcePage) failures.push(`Missing source page marker for ${module.id}`);
  if (!module.chunk.includes('learnSections')) failures.push(`Missing learnSections marker for ${module.id}`);
  if (!module.chunk.includes('flashcards')) failures.push(`Missing flashcards marker for ${module.id}`);
  if (!module.chunk.includes('quiz')) failures.push(`Missing quiz marker for ${module.id}`);
  if (!module.chunk.includes('examSummary')) failures.push(`Missing examSummary marker for ${module.id}`);
  if (!module.chunk.includes('sourceNote')) failures.push(`Missing sourceNote marker for ${module.id}`);
  if (module.sourceFile) {
    const known = sourceFiles.get(module.sourceFile);
    if (!known) {
      failures.push(`Unknown local source file ${module.sourceFile} for ${module.id}`);
    } else if (!existsSync(path.join(rootPath, known))) {
      failures.push(`Missing local source file ${known} for ${module.id}`);
    } else {
      report.sourceFilesChecked += 1;
    }
  }
}

for (const [name, relative] of sourceFiles) {
  const filePath = path.join(rootPath, relative);
  if (!existsSync(filePath)) failures.push(`Expected course source not found: ${name} at ${relative}`);
}

for (const asset of extractAssetRefs(sourceText)) {
  if (!existsSync(path.join(rootPath, 'public', asset.replace(/^\/+/, '')))) {
    failures.push(`Missing public asset ${asset}`);
  }
}

for (const forbidden of ['M x N x 3', 'k en RGB', '/chapitre_01/introduction', "status: 'to-refactor'"]) {
  if (sourceText.includes(forbidden)) failures.push(`Forbidden stale content marker found: ${forbidden}`);
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

  profileDir = mkdtempSync(path.join(os.tmpdir(), 'vision-audit-cdp-'));
  const remotePort = 9800 + Math.floor(Math.random() * 300);
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
  const viewports = [
    { name: 'desktop', width: 1360, height: 960, mobile: false, scale: 1 },
    { name: 'mobile', width: 390, height: 844, mobile: true, scale: 2 },
  ];

  for (const viewport of viewports) {
    await client.send('Emulation.setDeviceMetricsOverride', {
      width: viewport.width,
      height: viewport.height,
      deviceScaleFactor: viewport.scale,
      mobile: viewport.mobile,
    });

    for (const module of modules) {
      await auditLearn(client, viewport, module);
      await auditLab(client, viewport, module);
      await auditReview(client, viewport, module);
    }
  }

  await client.close();
} finally {
  if (chrome && !chrome.killed) chrome.kill();
  if (devServer && !devServer.killed) devServer.kill();
  if (profileDir && existsSync(profileDir)) {
    try {
      rmSync(profileDir, { recursive: true, force: true, maxRetries: 3, retryDelay: 200 });
    } catch {
      // Chrome can keep the temporary profile locked briefly on Windows.
    }
  }
}

writeFileSync(reportPath, JSON.stringify(report, null, 2));

if (failures.length > 0) {
  console.error(failures.join('\n'));
  console.error(`audit report: ${reportPath}`);
  process.exit(1);
}

console.log(`comprehensive site audit passed (${report.moduleCount} modules, ${report.routesChecked} routes, ${report.labPartsChecked} lab parts, ${report.reviewsChecked} reviews)`);
console.log(`audit report: ${reportPath}`);

async function auditLearn(client, viewport, module) {
  client.clearEvents();
  await navigate(client, `${baseUrl}/#${module.id}/learn`);
  const result = await client.evaluate(pageAuditExpression({
    viewport: viewport.name,
    moduleId: module.id,
    mode: 'learn',
    requireSelector: '.learnSurface',
    imageSelector: '.annotatedFigure img',
    minImages: 1,
    minCards: 3,
    cardSelector: '.lessonStep',
  }));
  report.routesChecked += 1;
  pushPageFailures(result);
  pushConsoleFailures(client.flushEvents(), viewport.name, module.id, 'learn');
}

async function auditLab(client, viewport, module) {
  client.clearEvents();
  await navigate(client, `${baseUrl}/#${module.id}/lab`);
  const base = await client.evaluate(pageAuditExpression({
    viewport: viewport.name,
    moduleId: module.id,
    mode: 'lab',
    requireSelector: '.labSurface',
    imageSelector: '.labVisualStage img',
    minImages: 1,
    minCards: 1,
    cardSelector: '[data-lab-part-id]',
  }));
  report.routesChecked += 1;
  pushPageFailures(base);
  const partIds = await client.evaluate(`(() => [...document.querySelectorAll('[data-lab-part-id]')].map((button) => button.getAttribute('data-lab-part-id')))()`);
  if (!Array.isArray(partIds) || partIds.length < 1) {
    failures.push(`${viewport.name}/${module.id}/lab has no lab parts`);
    return;
  }
  for (const partId of partIds) {
    const partResult = await client.evaluate(labPartProbe(partId));
    report.labPartsChecked += 1;
    if (!partResult.partActive) failures.push(`${viewport.name}/${module.id}/lab/${partId}: part did not activate`);
    if (!partResult.imagesLoaded) failures.push(`${viewport.name}/${module.id}/lab/${partId}: lab image not loaded`);
    if (partResult.primaryCount !== 1) failures.push(`${viewport.name}/${module.id}/lab/${partId}: expected one primary control, found ${partResult.primaryCount}`);
    if (!partResult.changed) failures.push(`${viewport.name}/${module.id}/lab/${partId}: primary control did not change visible output`);
    if (partResult.overflow) failures.push(`${viewport.name}/${module.id}/lab/${partId}: lab stage horizontal overflow`);
    if (partResult.badText) failures.push(`${viewport.name}/${module.id}/lab/${partId}: visible stale/internal text: ${partResult.badText}`);
  }
  pushConsoleFailures(client.flushEvents(), viewport.name, module.id, 'lab');
}

async function auditReview(client, viewport, module) {
  client.clearEvents();
  await navigate(client, `${baseUrl}/#${module.id}/review`);
  const result = await client.evaluate(pageAuditExpression({
    viewport: viewport.name,
    moduleId: module.id,
    mode: 'review',
    requireSelector: '.reviewSurface',
    imageSelector: '',
    minImages: 0,
    minCards: 4,
    cardSelector: '.examCard',
  }));
  report.routesChecked += 1;
  pushPageFailures(result);
  const reviewResult = await client.evaluate(reviewProbe());
  report.reviewsChecked += 1;
  if (!reviewResult.revealed) failures.push(`${viewport.name}/${module.id}/review: flashcard answer did not reveal`);
  if (!reviewResult.feedback) failures.push(`${viewport.name}/${module.id}/review: quiz feedback did not appear`);
  if (!reviewResult.nextQuestion) failures.push(`${viewport.name}/${module.id}/review: next question did not advance`);
  if (reviewResult.badText) failures.push(`${viewport.name}/${module.id}/review: visible stale/internal text: ${reviewResult.badText}`);
  pushConsoleFailures(client.flushEvents(), viewport.name, module.id, 'review');
}

function pageAuditExpression({ viewport, moduleId, mode, requireSelector, imageSelector, minImages, minCards, cardSelector }) {
  return `(() => {
    const failures = [];
    const required = document.querySelector('${requireSelector}');
    const textScope = document.querySelector('.modeSurface') || required || document.body;
    const text = textScope.innerText || '';
    const images = ${imageSelector ? `[...document.querySelectorAll('${imageSelector}')]` : '[]'};
    const cards = [...document.querySelectorAll('${cardSelector}')];
    const bodyOverflow = document.documentElement.scrollWidth > window.innerWidth + 2;
    const badText = visibleBadText(text);
    const overflowingLabels = [...document.querySelectorAll('button,.labPartButton,.modeSwitch button,.examCard,.lessonStep,.annotatedFigure figcaption')]
      .filter((element) => element.scrollWidth > element.clientWidth + 3)
      .slice(0, 3)
      .map((element) => (element.textContent || element.className || element.tagName).trim().slice(0, 80));
    if (!required) failures.push('missing required surface ${requireSelector}');
    if (!document.querySelector('h1')) failures.push('missing module h1');
    if (images.length < ${minImages}) failures.push('expected at least ${minImages} image(s), found ' + images.length);
    if (!images.every((img) => img.complete && img.naturalWidth > 0)) failures.push('some images are not loaded');
    if (cards.length < ${minCards}) failures.push('expected at least ${minCards} card/section item(s), found ' + cards.length);
    if (bodyOverflow) failures.push('document horizontal overflow');
    if (badText) failures.push('visible stale/internal text: ' + badText);
    if (overflowingLabels.length > 0) failures.push('text overflow: ' + overflowingLabels.join(' | '));
    return {
      viewport: '${viewport}',
      moduleId: '${moduleId}',
      mode: '${mode}',
      failures,
      title: document.querySelector('h1')?.textContent || '',
      imageCount: images.length,
      cardCount: cards.length,
      url: location.href,
    };

    function visibleBadText(value) {
      const match = value.match(/\\b(undefined|NaN|to-refactor)\\b|erode\\s*·|dilate\\s*·|lowpass\\s*·|highpass\\s*·|first\\s*·|B\\s+cross/i);
      return match ? match[0] : '';
    }
  })()`;
}

function labPartProbe(partId) {
  return `(() => new Promise((resolve) => {
    const button = document.querySelector('[data-lab-part-id="${partId}"]');
    if (button && !button.disabled) button.click();
    setTimeout(() => {
      const stage = document.querySelector('.labVisualStage');
      const activePart = document.querySelector('[data-lab-part-id="${partId}"][aria-pressed="true"]');
      const signature = () => stage ? [
        stage.innerText,
        ...[...stage.querySelectorAll('img')].map((img) => img.currentSrc + ':' + img.complete + ':' + img.naturalWidth),
        ...[...stage.querySelectorAll('.pixel,.roiPixel,.histogramBars > span,.curvePanel span,.rgbPreview,.processingPreview,.sourceDisplay,.spectrumBars > span,.kernelPixel,.kernelCell,.derivativeTrack span,.spectrumCell,.morphCell,.houghPoint,.houghLine,.accCell')].slice(0, 100).map((el) => getComputedStyle(el).backgroundColor + '/' + getComputedStyle(el).height + '/' + getComputedStyle(el).filter + '/' + getComputedStyle(el).transform),
      ].join('|') : '';
      const before = signature();
      const primaryControls = stage ? [...stage.querySelectorAll('[data-primary-control]')] : [];
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
            if (valueSetter) valueSetter.call(input, nextValue);
            else input.value = nextValue;
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
        const after = signature();
        const images = stage ? [...stage.querySelectorAll('img')] : [];
        const text = stage?.innerText || '';
        const badText = (text.match(/\\b(undefined|NaN|to-refactor)\\b|erode\\s*·|dilate\\s*·|lowpass\\s*·|highpass\\s*·|first\\s*·|B\\s+cross/i) || [''])[0];
        resolve({
          partActive: Boolean(activePart),
          imagesLoaded: images.every((img) => img.complete && img.naturalWidth > 0),
          primaryCount: primaryControls.length,
          changed: action && before !== after,
          overflow: stage ? stage.scrollWidth > stage.clientWidth + 2 : true,
          badText,
        });
      }, 150);
    }, 140);
  }))()`;
}

function reviewProbe() {
  return `(() => new Promise((resolve) => {
    const revealButton = [...document.querySelectorAll('button')].find((button) => button.textContent.includes('Afficher la réponse'));
    if (revealButton) revealButton.click();
    setTimeout(() => {
      const revealed = Boolean(document.querySelector('.answerBox'));
      const choice = document.querySelector('.answerChoices button:not([disabled])');
      if (choice) choice.click();
      setTimeout(() => {
        const validate = [...document.querySelectorAll('.quizActions button')].find((button) => button.textContent.includes('Valider'));
        if (validate && !validate.disabled) validate.click();
        setTimeout(() => {
          const feedback = Boolean(document.querySelector('.feedback'));
          const before = [...document.querySelectorAll('.examCard .cardHeader span')].find((span) => span.textContent.includes('Quiz'))?.textContent || '';
          const next = [...document.querySelectorAll('.quizActions button')].find((button) => button.textContent.includes('Question suivante'));
          if (next) next.click();
          setTimeout(() => {
            const after = [...document.querySelectorAll('.examCard .cardHeader span')].find((span) => span.textContent.includes('Quiz'))?.textContent || '';
            const text = document.querySelector('.reviewSurface')?.innerText || '';
            const badText = (text.match(/\\b(undefined|NaN|to-refactor)\\b|erode\\s*·|dilate\\s*·|lowpass\\s*·|highpass\\s*·|first\\s*·|B\\s+cross/i) || [''])[0];
            resolve({ revealed, feedback, nextQuestion: before !== after, badText });
          }, 120);
        }, 120);
      }, 120);
    }, 120);
  }))()`;
}

async function navigate(client, url) {
  await client.send('Page.navigate', { url });
  await delay(260);
}

function pushPageFailures(result) {
  for (const failure of result.failures) {
    failures.push(`${result.viewport}/${result.moduleId}/${result.mode}: ${failure}`);
  }
}

function pushConsoleFailures(events, viewport, moduleId, mode) {
  for (const event of events) {
    failures.push(`${viewport}/${moduleId}/${mode}: console ${event.level}: ${event.message}`);
  }
}

function extractModules(text) {
  const matches = [...text.matchAll(/^    id: '([^']+)',/gm)];
  return matches.map((match, index) => {
    const start = match.index;
    const end = index + 1 < matches.length ? matches[index + 1].index : text.length;
    const chunk = text.slice(start, end);
    const source = chunk.match(/source:\s*\{\s*file:\s*'([^']+)',\s*page:\s*'([^']+)'\s*\}/);
    const chapter = chunk.match(/chapter:\s*(\d+)/);
    return {
      id: match[1],
      chapter: chapter ? Number(chapter[1]) : 0,
      sourceFile: source?.[1] || '',
      sourcePage: source?.[2] || '',
      chunk,
    };
  });
}

function extractAssetRefs(text) {
  const refs = new Set();
  for (const match of text.matchAll(/assetPath:\s*'([^']+\.jpeg)'/g)) refs.add(match[1]);
  const bases = {
    c3: '/course-assets/chapter-03/filtrage-spatial-1',
    c4: '/course-assets/chapter-04/filtrage-spatial-passehaut',
    c4Lab: '/course-assets/chapter-04/labo-04',
    c5: '/course-assets/chapter-05/fourier-domaine-frequenciel',
    c5Lab: '/course-assets/chapter-05/labo-05',
    c6: '/course-assets/chapter-06/morphology',
    c6Lab: '/course-assets/chapter-06/labo-06',
    c7: '/course-assets/chapter-07/transformation-de-hough',
    c7Lab: '/course-assets/chapter-07/labo-07',
  };
  for (const match of text.matchAll(/fig\((c\d(?:Lab)?), '([^']+\.jpeg)'/g)) {
    refs.add(`${bases[match[1]]}/${match[2]}`);
  }
  return [...refs];
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
  let events = [];
  ws.addEventListener('message', (event) => {
    const message = JSON.parse(event.data);
    if (pending.has(message.id)) {
      pending.get(message.id)(message);
      pending.delete(message.id);
      return;
    }
    if (message.method === 'Runtime.exceptionThrown') {
      events.push({ level: 'exception', message: message.params?.exceptionDetails?.text || 'runtime exception' });
    }
    if (message.method === 'Runtime.consoleAPICalled' && message.params?.type === 'error') {
      events.push({ level: 'error', message: message.params.args?.map((arg) => arg.value || arg.description || '').join(' ') || 'console error' });
    }
    if (message.method === 'Log.entryAdded' && ['error', 'warning'].includes(message.params?.entry?.level)) {
      events.push({ level: message.params.entry.level, message: message.params.entry.text });
    }
  });

  const send = (method, params = {}) => {
    const messageId = ++id;
    ws.send(JSON.stringify({ id: messageId, method, params }));
    return new Promise((resolve) => pending.set(messageId, resolve));
  };

  await send('Runtime.enable');
  await send('Page.enable');
  await send('Log.enable');

  return {
    send,
    clearEvents() {
      events = [];
    },
    flushEvents() {
      const flushed = events;
      events = [];
      return flushed;
    },
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
