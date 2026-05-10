import { existsSync, readFileSync } from 'node:fs';

const source = readFileSync(new URL('../src/data/advancedChapters.ts', import.meta.url), 'utf8');
const app = readFileSync(new URL('../src/App.tsx', import.meta.url), 'utf8');
const styles = readFileSync(new URL('../src/styles.css', import.meta.url), 'utf8');

const expectedModules = {
  3: [
    'frequences-spatiales',
    'convolution-correlation-kernel',
    'lissage-passe-bas',
    'bilateral-preservation-contours',
  ],
  4: [
    'passe-haut-transitions',
    'gradient-sobel-bruit',
    'laplacien-log-highboost',
    'canny-contours',
  ],
  5: [
    'fourier-bases-frequences',
    'dft-fft-spectre',
    'filtrage-frequentiel',
    'aliasing-nyquist',
  ],
  6: [
    'morphologie-elements-structurants',
    'erosion-dilatation',
    'ouverture-fermeture',
    'gradient-morphologique-contours',
  ],
  7: [
    'hough-principe-formes',
    'hough-parametres-polaires',
    'hough-accumulateur-votes',
    'hough-labo-lignes',
  ],
};

const requiredLabKinds = [
  'spatial-lowpass',
  'spatial-kernel',
  'spatial-highpass',
  'fourier',
  'morphology',
  'hough',
];

const requiredSourceMarkers = [
  'filtrageSpatial_1.md',
  'labo_03.md',
  'filtrageSpatial_passehaut.md',
  'labo_04.md',
  'Fourier_domaine_frequenciel.md',
  'labo_05.md',
  'morphology.md',
  'labo_06.md',
  'transformation_de_hough.md',
  'labo_07.md',
];

const requiredConceptMarkers = [
  'Fréquence spatiale',
  'somme de produits',
  'Gauss(spatial)',
  'f’(x)=f(x+1)-f(x)',
  'g(x,y)=Real[IDFT(H(p,q) S(p,q))]',
  'Nyquist-Shannon',
  'Élément structurant',
  'A⊖B',
  'ρ = x cosθ + y sinθ',
];

const basePaths = {
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

const failures = [];

for (const [chapter, ids] of Object.entries(expectedModules)) {
  const chapterMatches = source.match(new RegExp(`chapter: ${chapter}`, 'g')) || [];
  if (chapterMatches.length !== ids.length) {
    failures.push(`Expected ${ids.length} modules for chapter ${chapter}, found ${chapterMatches.length}.`);
  }
  for (const id of ids) {
    if (!source.includes(`id: '${id}'`)) failures.push(`Missing advanced module id: ${id}`);
  }
}

for (const kind of requiredLabKinds) {
  if (!source.includes(`kind: '${kind}'`)) failures.push(`Missing advanced lab kind in data: ${kind}`);
  if (!app.includes(`data-lab-kind="${kind}"`)) failures.push(`Missing advanced lab visual in App.tsx: ${kind}`);
}

for (const marker of requiredSourceMarkers) {
  if (!source.includes(marker)) failures.push(`Missing local source marker: ${marker}`);
}

for (const marker of requiredConceptMarkers) {
  if (!source.includes(marker) && !app.includes(marker)) failures.push(`Missing source-backed concept marker: ${marker}`);
}

for (const className of ['advancedLab', 'advancedCourseFrame', 'spectrumBars', 'kernelMatrix', 'derivativeTrack', 'morphGrid', 'houghPlane']) {
  if (!styles.includes(`.${className}`)) failures.push(`Missing advanced style: ${className}`);
}

const figureCalls = [...source.matchAll(/fig\((c\d(?:Lab)?), '([^']+\.jpeg)'/g)];
if (figureCalls.length < 50) {
  failures.push(`Expected at least 50 figure references for chapters 3-7, found ${figureCalls.length}.`);
}

for (const [, base, file] of figureCalls) {
  const publicPath = basePaths[base];
  if (!publicPath) {
    failures.push(`Unknown asset base ${base} for ${file}`);
    continue;
  }
  const asset = new URL(`../public${publicPath}/${file}`, import.meta.url);
  if (!existsSync(asset)) failures.push(`Missing advanced course asset: ${publicPath}/${file}`);
}

if (source.includes("status: 'to-refactor'")) {
  failures.push('Advanced modules must not be marked to-refactor.');
}

if (failures.length > 0) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log('advanced chapter validation passed');
