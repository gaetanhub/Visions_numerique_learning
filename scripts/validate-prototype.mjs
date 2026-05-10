import { existsSync, readFileSync } from 'node:fs';

const source = readFileSync(new URL('../src/data/prototype.ts', import.meta.url), 'utf8');

const moduleIds = [
  'vision-humaine',
  'sources-images',
  'traitement-analyse',
  'definition-image',
  'representation-couleur',
  'roi-resize-interpolation',
];

const failures = [];

for (const id of moduleIds) {
  if (!source.includes(`id: '${id}'`)) failures.push(`Missing module id: ${id}`);
}

if (source.includes("status: 'to-refactor'")) {
  failures.push('Some chapter 1 modules are still marked to-refactor.');
}

for (const requiredExport of [
  'export const moduleContent',
  'learnSections',
  'figureNotes',
  'flashcards',
  'quiz',
  'lab',
]) {
  if (!source.includes(requiredExport)) failures.push(`Missing expected content marker: ${requiredExport}`);
}

const chapter1FigureRefs = [...source.matchAll(/file: '(introduction_[^']+\.jpeg)'/g)].map((match) => match[1]);
if (chapter1FigureRefs.length === 0) {
  failures.push('No course figure references found.');
}

for (const file of chapter1FigureRefs) {
  const path = new URL(`../public/course-assets/chapter-01/introduction/${file}`, import.meta.url);
  if (!existsSync(path)) failures.push(`Missing course figure asset: ${file}`);
}

const publicAssetRefs = [...source.matchAll(/assetPath: '(\/course-assets\/[^']+\.jpeg)'/g)].map((match) => match[1]);
for (const assetPath of publicAssetRefs) {
  const path = new URL(`../public${assetPath}`, import.meta.url);
  if (!existsSync(path)) failures.push(`Missing public course asset: ${assetPath}`);
}

for (const forbidden of ['M x N x 3', 'k en RGB', '/chapitre_01/introduction']) {
  if (source.includes(forbidden)) failures.push(`Forbidden stale or inaccurate content found: ${forbidden}`);
}

if (failures.length > 0) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log('prototype validation passed');
