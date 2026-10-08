// Single source of truth for "what decks exist and what do we know about them".
// Used by the Astro content collection (src/content.config.ts) and by every
// script in scripts/. A deck is a folder decks/<slug>/ containing slides.md;
// everything the site shows about it comes from that file's headmatter.

import { existsSync } from 'node:fs';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { parse as parseYaml } from 'yaml';

/** Repo root. Every npm script runs from here. */
export const ROOT = process.cwd();
export const DECKS_DIR = path.join(ROOT, 'decks');

/** <year>-<kebab-title>, e.g. 2026-building-a-provider. It becomes the URL. */
export const SLUG_PATTERN = /^\d{4}-[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Allowed values for `card.type`. Add a new kind here, nowhere else. */
export const DECK_TYPES = /** @type {const} */ (['talk', 'case-study', 'note', 'open-source']);

/**
 * @typedef {object} Deck
 * @property {string} slug        Folder name and URL segment.
 * @property {string} entry       Absolute path to slides.md.
 * @property {string} title
 * @property {string} description Plain-text summary (from `info`).
 * @property {string} date        ISO date, YYYY-MM-DD.
 * @property {string} type        One of DECK_TYPES.
 * @property {string} [event]     Where it was given, if anywhere.
 * @property {string[]} tags
 * @property {boolean} draft      Drafts are skipped by production builds.
 * @property {Record<string, string>} links  Extra links: video, repo, post.
 * @property {number} slides      Slide count.
 * @property {string} [routerMode]
 */

const HEADMATTER = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/;

/** Strip the light Markdown that Slidev's `info` field tends to contain. */
function toPlainText(value) {
  return String(value ?? '')
    .replace(/^#+\s+.*$/gm, '')
    .replace(/[*_`]/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

/** YAML turns a bare 2026-10-08 into a string here, but be lenient. */
function toIsoDate(value) {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return typeof value === 'string' ? value.trim() : '';
}

async function countSlides(entry) {
  // Slidev's own parser resolves `src:` imports and compound separators, so the
  // number matches what the audience sees.
  const { load } = await import('@slidev/parser/fs');
  const data = await load(path.dirname(entry), entry);
  return data.slides.length;
}

/**
 * Read one deck.
 * @param {string} slug
 * @returns {Promise<Deck>}
 */
export async function readDeck(slug) {
  const entry = path.join(DECKS_DIR, slug, 'slides.md');
  const source = await readFile(entry, 'utf8');
  const match = source.match(HEADMATTER);
  const head = (match ? parseYaml(match[1]) : null) ?? {};
  const card = head.card ?? {};

  return {
    slug,
    entry,
    title: String(head.title ?? '').trim(),
    description: toPlainText(head.info),
    date: toIsoDate(card.date),
    type: String(card.type ?? '').trim(),
    event: card.event ? String(card.event).trim() : undefined,
    tags: Array.isArray(card.tags) ? card.tags.map(String) : [],
    draft: card.draft === true,
    links: Object.fromEntries(
      Object.entries(card.links ?? {}).map(([name, url]) => [name, String(url)]),
    ),
    slides: await countSlides(entry),
    routerMode: head.routerMode,
  };
}

/**
 * Every deck in decks/, newest first.
 * @returns {Promise<Deck[]>}
 */
export async function listDecks() {
  if (!existsSync(DECKS_DIR)) return [];
  const entries = await readdir(DECKS_DIR, { withFileTypes: true });
  const slugs = entries
    .filter((e) => e.isDirectory() && existsSync(path.join(DECKS_DIR, e.name, 'slides.md')))
    .map((e) => e.name);
  const decks = await Promise.all(slugs.map(readDeck));
  return decks.sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));
}

/**
 * The rules every deck has to meet before it can be published.
 * @param {Deck} deck
 * @returns {string[]} Human-readable problems; empty when the deck is fine.
 */
export function validateDeck(deck) {
  const problems = [];
  if (!SLUG_PATTERN.test(deck.slug)) {
    problems.push(`folder name must look like 2026-short-title (lowercase, digits, hyphens)`);
  }
  if (!deck.title) problems.push('`title` is missing from the headmatter');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(deck.date) || Number.isNaN(Date.parse(deck.date))) {
    problems.push('`card.date` must be a date like 2026-10-08');
  } else if (SLUG_PATTERN.test(deck.slug) && !deck.slug.startsWith(deck.date.slice(0, 4))) {
    problems.push(`folder name starts with ${deck.slug.slice(0, 4)} but \`card.date\` is in ${deck.date.slice(0, 4)}`);
  }
  if (!DECK_TYPES.includes(/** @type {any} */ (deck.type))) {
    problems.push(`\`card.type\` must be one of: ${DECK_TYPES.join(', ')}`);
  }
  if (deck.routerMode !== 'hash') {
    problems.push('`routerMode: hash` is required (GitHub Pages cannot rewrite deep links)');
  }
  return problems;
}

/**
 * Join the site base path (from BASE_PATH) with a path inside the site.
 * @param {string} pathname  e.g. "decks/2026-hello-world/"
 */
export function withBase(pathname, base = process.env.BASE_PATH || '/') {
  return `${base.replace(/\/+$/, '')}/${pathname.replace(/^\/+/, '')}`;
}
