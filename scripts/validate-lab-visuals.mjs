import { readFileSync } from 'node:fs';

const app = readFileSync(new URL('../src/App.tsx', import.meta.url), 'utf8');
const styles = readFileSync(new URL('../src/styles.css', import.meta.url), 'utf8');

const failures = [];
const labKinds = [
  'vision',
  'sources',
  'pipeline',
  'pixels',
  'color',
  'roi',
  'intensity-map',
  'intensity-invert',
  'intensity-gamma',
  'histogram',
  'histogram-equalization',
  'spatial-lowpass',
  'spatial-kernel',
  'spatial-highpass',
  'fourier',
  'morphology',
  'hough',
];

for (const kind of labKinds) {
  if (!app.includes(`data-lab-kind="${kind}"`)) {
    failures.push(`Missing primary visual stage for lab kind: ${kind}`);
  }
}

for (const className of [
  'labVisualStage',
  'courseVisualImage',
  'adaptiveOverlay',
  'visualGrid',
  'processingPreview',
  'resizePreview',
  'intensityWorkbench',
  'curvePanel',
  'histogramBars',
  'histCompare',
  'advancedWorkbench',
  'kernelWorkbench',
  'edgeWorkbench',
  'fourierWorkbench',
  'morphWorkbench',
  'houghWorkbench',
  'spectrumGrid',
  'accumulatorGrid',
]) {
  if (!styles.includes(`.${className}`)) {
    failures.push(`Missing lab visual style: ${className}`);
  }
}

if (failures.length > 0) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log('lab visual validation passed');
