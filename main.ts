import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const repository = fileURLToPath(new URL('.', import.meta.url));
const destination = resolve(process.env.MAKEFUN_OUTPUT_DIR || '/output');
const dossierLimits = {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16777216,
};

function exportDirectory(name: string, required: boolean): void {
  const target = join(destination, name);
  mkdirSync(target, { recursive: true });
  const source = join(repository, name);
  if (required || existsSync(source)) cpSync(source, target, { recursive: true });
}

mkdirSync(destination, { recursive: true });
exportDirectory('app', true);
exportDirectory('screenshots', false);
const dossier = buildDossier(destination, dossierLimits);
writeFileSync(join(destination, 'dossier.json'), dossier);
console.log(`Site and dossier written to ${destination}`);
