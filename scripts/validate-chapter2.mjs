import { existsSync, readFileSync } from 'node:fs';

const source = readFileSync(new URL('../src/data/prototype.ts', import.meta.url), 'utf8');

const requiredModules = [
  'intensite-principes',
  'identite-inversion',
  'log-gamma',
  'histogrammes-intensite',
  'normalisation-egalisation',
];

const requiredLabKinds = [
  'intensity-map',
  'intensity-invert',
  'intensity-gamma',
  'histogram',
  'histogram-equalization',
];

const failures = [];

for (const id of requiredModules) {
  if (!source.includes(`id: '${id}'`)) failures.push(`Missing chapter 2 module id: ${id}`);
}

for (const kind of requiredLabKinds) {
  if (!source.includes(`kind: '${kind}'`)) failures.push(`Missing chapter 2 lab kind: ${kind}`);
}

if (!source.includes('chapter: 2')) {
  failures.push('Chapter 2 modules must be explicitly marked with chapter: 2.');
}

for (const marker of ['transformationIntensite.md', 'labo_02.md']) {
  if (!source.includes(marker)) failures.push(`Missing source marker: ${marker}`);
}

const figureRefs = [...source.matchAll(/assetPath: '\/course-assets\/chapter-02\/([^']+\.jpeg)'/g)].map((match) => match[1]);
if (figureRefs.length < 10) {
  failures.push(`Expected at least 10 chapter 2 figure references, found ${figureRefs.length}.`);
}

for (const relative of figureRefs) {
  const file = new URL(`../public/course-assets/chapter-02/${relative}`, import.meta.url);
  if (!existsSync(file)) failures.push(`Missing chapter 2 figure asset: ${relative}`);
}

for (const stale of ['Chapitre 1 complet', 'completedModules}/6']) {
  if (source.includes(stale)) failures.push(`Stale chapter 1-only marker in data: ${stale}`);
}

if (failures.length > 0) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log('chapter 2 validation passed');
