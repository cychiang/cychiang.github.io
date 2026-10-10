// Create a new post from the template:
//   pnpm new:post 2026-why-reconcile-loops "Why reconcile loops"
import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { ROOT, SLUG_PATTERN } from './lib/decks.ts';
import { POSTS_DIR } from './lib/posts.ts';

const [slug, title] = process.argv.slice(2);

if (!slug || !title) {
  console.error('Usage: pnpm new:post <year>-<short-title> "Post title"');
  process.exit(1);
}
if (!SLUG_PATTERN.test(slug)) {
  console.error(`"${slug}" is not a valid post name. Use <year>-<short-title>, lowercase with hyphens.`);
  process.exit(1);
}
const file = path.join(POSTS_DIR, `${slug}.md`);
if (existsSync(file)) {
  console.error(`posts/${slug}.md already exists.`);
  process.exit(1);
}

// The same template OpenKnowledge offers in its editor, minus its own header.
const template = await readFile(path.join(ROOT, '.ok', 'templates', 'post.md'), 'utf8');
const today = new Date().toISOString().slice(0, 10);
const body = template
  .replace(/^template:\n(?: {2}.*\n)+/m, '')
  .replaceAll('{{date}}', `${slug.slice(0, 4)}${today.slice(4)}`)
  .replace(/^title: .*$/m, `title: "${title.replaceAll('"', '\\"')}"`);

await mkdir(POSTS_DIR, { recursive: true });
await writeFile(file, body);
console.log(`Created posts/${slug}.md (draft). Write it in OpenKnowledge or any editor; set draft: false to publish.`);
