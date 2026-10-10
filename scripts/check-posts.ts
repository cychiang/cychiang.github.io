// Validate every post's file name and frontmatter. Exits non-zero on problems.
import { listPosts, validatePost } from './lib/posts.ts';

const posts = await listPosts();
let failed = 0;

for (const post of posts) {
  const problems = validatePost(post);
  if (problems.length === 0) {
    console.log(`ok    posts/${post.slug}.md${post.draft ? ' (draft)' : ''}`);
    continue;
  }
  failed += 1;
  console.error(`FAIL  posts/${post.slug}.md`);
  for (const problem of problems) console.error(`      - ${problem}`);
}

if (failed > 0) {
  console.error(`\n${failed} of ${posts.length} post(s) need fixing. See AGENTS.md, "Writing a post".`);
  process.exit(1);
}
console.log(`\n${posts.length} post(s) checked.`);
