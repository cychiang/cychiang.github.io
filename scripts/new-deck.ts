// Create a new deck from the template:
//   pnpm new:deck 2026-building-a-provider "Building a provider from scratch"
import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { DECKS_DIR, ROOT, SLUG_PATTERN } from './lib/decks.ts';

const [slug, title] = process.argv.slice(2);

if (!slug || !title) {
  console.error('Usage: pnpm new:deck <year>-<short-title> "Deck title"');
  process.exit(1);
}
if (!SLUG_PATTERN.test(slug)) {
  console.error(`"${slug}" is not a valid deck name. Use <year>-<short-title>, lowercase with hyphens.`);
  process.exit(1);
}

const dir = path.join(DECKS_DIR, slug);
if (existsSync(dir)) {
  console.error(`decks/${slug} already exists.`);
  process.exit(1);
}

const today = new Date().toISOString().slice(0, 10);
const template = await readFile(path.join(ROOT, 'scripts', 'templates', 'slides.md'), 'utf8');
const slides = template
  .replaceAll('__TITLE__', title.replaceAll('"', '\\"'))
  .replaceAll('__DATE__', `${slug.slice(0, 4)}${today.slice(4)}`);

await mkdir(dir, { recursive: true });
await writeFile(path.join(dir, 'slides.md'), slides);

console.log(`Created decks/${slug}/slides.md (draft).`);
console.log(`Write it with:  pnpm deck ${slug}`);
