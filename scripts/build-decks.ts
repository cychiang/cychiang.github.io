// Build every published deck into dist/decks/<slug>/ so it is served next to
// the Astro site. Run after `astro build` (see the `build` package script).
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { ROOT, SLIDEV_BIN, listDecks, validateDeck, withBase } from './lib/decks.ts';

const decks = (await listDecks()).filter((deck) => !deck.draft);

for (const deck of decks) {
  const problems = validateDeck(deck);
  if (problems.length > 0) {
    console.error(`decks/${deck.slug} cannot be built:`);
    for (const problem of problems) console.error(`  - ${problem}`);
    process.exit(1);
  }
}

for (const deck of decks) {
  const base = withBase(`decks/${deck.slug}/`);
  const out = path.join(ROOT, 'dist', 'decks', deck.slug);
  console.log(`\nBuilding decks/${deck.slug} -> ${base}`);
  const result = spawnSync(
    process.execPath,
    [SLIDEV_BIN, 'build', deck.entry, '--base', base, '--out', out],
    { cwd: ROOT, stdio: 'inherit' },
  );
  if (result.status !== 0) process.exit(result.status ?? 1);
}

console.log(`\nBuilt ${decks.length} deck(s).`);
