import { defineConfig } from 'astro/config';
import { shikiThemes } from './design/shiki.ts';

// SITE_URL and BASE_PATH are provided by the deploy workflow (from
// actions/configure-pages), so the same source works whether GitHub serves the
// site at the domain root or under a /<repo>/ sub-path. Locally both default
// to the root.
export default defineConfig({
  site: process.env.SITE_URL || 'http://localhost:4321',
  base: process.env.BASE_PATH || '/',
  trailingSlash: 'ignore',
  markdown: {
    // Code in posts uses the same colours as code on slides. With
    // defaultColor off, both palettes are emitted as --shiki-light/--shiki-dark
    // and global.css picks one by the colour scheme.
    shikiConfig: { themes: shikiThemes, defaultColor: false },
  },
});
