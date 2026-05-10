import { readFileSync } from 'node:fs';

const app = readFileSync(new URL('../src/App.tsx', import.meta.url), 'utf8');
const failures = [];

for (const marker of ['parseInitialRoute', 'hashchange', '#${selectedModule.id}/${mode}']) {
  if (!app.includes(marker)) failures.push(`Missing deep-link marker: ${marker}`);
}

if (failures.length > 0) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log('deep-link validation passed');
