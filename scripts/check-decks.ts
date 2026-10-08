// Validate every deck's folder name and headmatter. Exits non-zero on problems.
import { listDecks, validateDeck } from './lib/decks.ts';

const decks = await listDecks();
let failed = 0;

for (const deck of decks) {
  const problems = validateDeck(deck);
  if (problems.length === 0) {
    console.log(`ok    decks/${deck.slug}${deck.draft ? ' (draft)' : ''}`);
    continue;
  }
  failed += 1;
  console.error(`FAIL  decks/${deck.slug}`);
  for (const problem of problems) console.error(`      - ${problem}`);
}

if (failed > 0) {
  console.error(`\n${failed} of ${decks.length} deck(s) need fixing. See AGENTS.md, "Deck rules".`);
  process.exit(1);
}
console.log(`\n${decks.length} deck(s) checked.`);
