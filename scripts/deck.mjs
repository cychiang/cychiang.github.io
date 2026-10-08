// Start the Slidev dev server for one deck:  npm run deck -- <slug>
// Extra arguments are passed to Slidev:      npm run deck -- <slug> --port 3031
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { DECKS_DIR, ROOT, listDecks } from './lib/decks.mjs';

const [slug, ...rest] = process.argv.slice(2);
const entry = slug ? path.join(DECKS_DIR, slug, 'slides.md') : '';

if (!slug || !existsSync(entry)) {
  const decks = await listDecks();
  console.error(slug ? `No deck at decks/${slug}/slides.md.` : 'Usage: npm run deck -- <slug>');
  console.error(decks.length ? `\nDecks:\n${decks.map((d) => `  ${d.slug}`).join('\n')}` : '\nNo decks yet.');
  process.exit(1);
}

const slidev = path.join(ROOT, 'node_modules', '@slidev', 'cli', 'bin', 'slidev.mjs');
const result = spawnSync(process.execPath, [slidev, entry, ...rest], { cwd: ROOT, stdio: 'inherit' });
process.exit(result.status ?? 0);
