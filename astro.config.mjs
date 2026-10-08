// @ts-check
import { defineConfig } from 'astro/config';

// SITE_URL and BASE_PATH are provided by the deploy workflow (from
// actions/configure-pages), so the same source works whether GitHub serves the
// site at the domain root or under a /<repo>/ sub-path. Locally both default
// to the root.
const base = process.env.BASE_PATH || '/';

export default defineConfig({
  site: process.env.SITE_URL || 'http://localhost:4321',
  base,
  trailingSlash: 'ignore',
});
