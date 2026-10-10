// Build every published deck into dist/decks/<slug>/ so it is served next to
// the Astro site. Run after `astro build` (see the `build` package script).
import { spawnSync } from 'node:child_process';
import { copyFile, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { ROOT, SLIDEV_BIN, listDecks, validateDeck, withBase } from './lib/decks.ts';
import type { Deck } from './lib/decks.ts';
import { site } from '../src/site.config.ts';

// The same origin Astro builds with (see astro.config.ts), so links and
// previews point at the published site.
const SITE_URL = process.env.SITE_URL || 'http://localhost:4321';

const escapeHtml = (text: string) =>
  text.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);

/**
 * Slidev's page carries a "- Slidev" title suffix, a raw description and no
 * canonical URL or preview image. Replace those with the same metadata the
 * homepage and posts carry, pointing at the preview image Astro rendered for
 * this deck.
 */
async function addSeoMeta(deck: Deck, out: string) {
  const file = path.join(out, 'index.html');
  const url = new URL(withBase(`decks/${deck.slug}/`), SITE_URL).href;
  const image = new URL(withBase(`og/decks/${deck.slug}.png`), SITE_URL).href;
  const title = escapeHtml(deck.title);
  const description = escapeHtml(deck.description);
  const tags = [
    `<title>${title} | ${escapeHtml(site.name)}</title>`,
    `<link rel="canonical" href="${url}">`,
    `<meta name="author" content="${escapeHtml(site.author.name)}">`,
    `<meta name="description" content="${description}">`,
    `<meta property="og:type" content="website">`,
    `<meta property="og:title" content="${title}">`,
    `<meta property="og:description" content="${description}">`,
    `<meta property="og:url" content="${url}">`,
    `<meta property="og:image" content="${image}">`,
    `<meta property="og:image:width" content="1200">`,
    `<meta property="og:image:height" content="630">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${title}">`,
    `<meta name="twitter:description" content="${description}">`,
    `<meta name="twitter:image" content="${image}">`,
  ].join('\n    ');
  const html = (await readFile(file, 'utf8'))
    .replace(/<title>[^<]*<\/title>\s*/g, '')
    .replace(/<meta (?:name="description"|property="og:[a-z:]+") content="[^"]*">\s*/g, '');
  await writeFile(file, html.replace('</head>', `    ${tags}\n  </head>`));
}

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
  // The theme's default favicon is `favicon.svg`, relative to the deck.
  await copyFile(path.join(ROOT, 'public', 'favicon.svg'), path.join(out, 'favicon.svg'));
  await addSeoMeta(deck, out);
}

console.log(`\nBuilt ${decks.length} deck(s).`);
