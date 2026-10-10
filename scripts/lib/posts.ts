// Posts: Markdown notes in posts/<year>-<kebab-title>.md, written in
// OpenKnowledge or any editor, published at /posts/<slug>/. The rules every
// post has to meet live here, next to the deck rules in decks.ts.
import { existsSync } from 'node:fs';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { parse as parseYaml } from 'yaml';
import { ROOT, SLUG_PATTERN } from './decks.ts';

export const POSTS_DIR = path.join(ROOT, 'posts');

export interface Post {
  slug: string;
  file: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  draft: boolean;
}

const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/;

function toIsoDate(value: unknown): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return typeof value === 'string' ? value.trim() : '';
}

export async function readPost(slug: string): Promise<Post> {
  const file = path.join(POSTS_DIR, `${slug}.md`);
  const source = await readFile(file, 'utf8');
  const head: Record<string, any> = (source.match(FRONTMATTER)?.[1] && parseYaml(source.match(FRONTMATTER)![1]!)) || {};
  return {
    slug,
    file,
    title: String(head.title ?? '').trim(),
    description: String(head.description ?? '').trim(),
    date: toIsoDate(head.date),
    tags: Array.isArray(head.tags) ? head.tags.map(String) : [],
    draft: head.draft === true,
  };
}

/** Every post in posts/, newest first. */
export async function listPosts(): Promise<Post[]> {
  if (!existsSync(POSTS_DIR)) return [];
  const entries = await readdir(POSTS_DIR, { withFileTypes: true });
  const slugs = entries.filter((e) => e.isFile() && e.name.endsWith('.md')).map((e) => e.name.slice(0, -3));
  const posts = await Promise.all(slugs.map(readPost));
  return posts.sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));
}

/** Human-readable problems; empty when the post is fine. */
export function validatePost(post: Post): string[] {
  const problems: string[] = [];
  if (!SLUG_PATTERN.test(post.slug)) {
    problems.push('file name must look like 2026-short-title.md (lowercase, digits, hyphens)');
  }
  if (!post.title) problems.push('`title` is missing from the frontmatter');
  if (!post.description) problems.push('`description` is missing from the frontmatter');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(post.date) || Number.isNaN(Date.parse(post.date))) {
    problems.push('`date` must be a date like 2026-10-10');
  } else if (SLUG_PATTERN.test(post.slug) && !post.slug.startsWith(post.date.slice(0, 4))) {
    problems.push(`file name starts with ${post.slug.slice(0, 4)} but \`date\` is in ${post.date.slice(0, 4)}`);
  }
  return problems;
}
