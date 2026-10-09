// Single source of truth for "what decks exist and what do we know about them".
// Used by the Astro content collection (src/content.config.ts) and by every
// script in scripts/. A deck is a folder decks/<slug>/ containing slides.md;
// everything the site shows about it comes from that file's headmatter.
//
// Scripts are run directly by Node (type stripping), so this file sticks to
// erasable TypeScript: no enums, no parameter properties, `import type` only.

import { existsSync } from 'node:fs';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { load } from '@slidev/parser/fs';
import { parse as parseYaml } from 'yaml';

/** Repo root. Every package script runs from here. */
export const ROOT = process.cwd();
export const DECKS_DIR = path.join(ROOT, 'decks');

/** Slidev's CLI entry, for scripts that start a build or a dev server. */
export const SLIDEV_BIN = path.join(ROOT, 'node_modules', '@slidev', 'cli', 'bin', 'slidev.mjs');

/** <year>-<kebab-title>, e.g. 2026-building-a-provider. It becomes the URL. */
export const SLUG_PATTERN = /^\d{4}-[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Allowed values for `card.type`. Add a new kind here, nowhere else. */
export const DECK_TYPES = ['talk', 'case-study', 'note', 'open-source'] as const;
export type DeckType = (typeof DECK_TYPES)[number];

export interface Deck {
  /** Folder name and URL segment. */
  slug: string;
  /** Absolute path to slides.md. */
  entry: string;
  title: string;
  /** Plain-text summary, from `info`. */
  description: string;
  /** ISO date, YYYY-MM-DD. */
  date: string;
  /** One of DECK_TYPES once validated; whatever was written until then. */
  type: string;
  /** Where it was given, if anywhere. */
  event?: string;
  tags: string[];
  /** Drafts are skipped by production builds. */
  draft: boolean;
  /** Extra links: video, repo, post. */
  links: Record<string, string>;
  /** Slide count. */
  slides: number;
  routerMode?: string;
  theme?: string;
}

const HEADMATTER = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/;

/** Strip the light Markdown that Slidev's `info` field tends to contain. */
function toPlainText(value: unknown): string {
  return String(value ?? '')
    .replace(/^#+\s+.*$/gm, '')
    .replace(/[*_`]/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

function toIsoDate(value: unknown): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return typeof value === 'string' ? value.trim() : '';
}

/**
 * Slidev's own parser resolves `src:` imports and compound separators, so the
 * number matches what the audience sees.
 */
async function countSlides(entry: string): Promise<number> {
  const deckRoot = path.dirname(entry);
  const data = await load({ roots: [deckRoot], userRoot: deckRoot }, entry);
  return data.slides.length;
}

/** Read one deck. */
export async function readDeck(slug: string): Promise<Deck> {
  const entry = path.join(DECKS_DIR, slug, 'slides.md');
  const source = await readFile(entry, 'utf8');
  const match = source.match(HEADMATTER);
  const head: Record<string, any> = (match ? parseYaml(match[1] ?? '') : null) ?? {};
  const card: Record<string, any> = head.card ?? {};

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
    theme: head.theme === undefined ? undefined : String(head.theme),
  };
}

/** Every deck in decks/, newest first. */
export async function listDecks(): Promise<Deck[]> {
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
 * Returns human-readable problems; empty when the deck is fine.
 */
export function validateDeck(deck: Deck): string[] {
  const problems: string[] = [];
  if (!SLUG_PATTERN.test(deck.slug)) {
    problems.push('folder name must look like 2026-short-title (lowercase, digits, hyphens)');
  }
  if (!deck.title) problems.push('`title` is missing from the headmatter');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(deck.date) || Number.isNaN(Date.parse(deck.date))) {
    problems.push('`card.date` must be a date like 2026-10-08');
  } else if (SLUG_PATTERN.test(deck.slug) && !deck.slug.startsWith(deck.date.slice(0, 4))) {
    problems.push(
      `folder name starts with ${deck.slug.slice(0, 4)} but \`card.date\` is in ${deck.date.slice(0, 4)}`,
    );
  }
  if (!(DECK_TYPES as readonly string[]).includes(deck.type)) {
    problems.push(`\`card.type\` must be one of: ${DECK_TYPES.join(', ')}`);
  }
  if (deck.theme !== 'terminal') {
    problems.push('`theme: terminal` is required so every deck follows the design system');
  }
  if (deck.routerMode !== 'hash') {
    problems.push('`routerMode: hash` is required (GitHub Pages cannot rewrite deep links)');
  }
  return problems;
}

/**
 * Join the site base path (from BASE_PATH) with a path inside the site,
 * e.g. withBase('decks/2026-hello-world/').
 */
export function withBase(pathname: string, base: string = process.env.BASE_PATH || '/'): string {
  return `${base.replace(/\/+$/, '')}/${pathname.replace(/^\/+/, '')}`;
}
