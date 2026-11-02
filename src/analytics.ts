// Google Analytics 4. Off unless GA_MEASUREMENT_ID is set at build time (the
// deploy workflow sets it from a repository variable), so local builds, previews
// and pull requests send nothing. Shared by Base.astro and scripts/build-decks.ts.

const MEASUREMENT_ID = /^G-[A-Z0-9]{4,}$/;

/** The configured measurement ID, or undefined when analytics is off or malformed. */
export function measurementId(env: Record<string, string | undefined>): string | undefined {
  const id = env.GA_MEASUREMENT_ID?.trim();
  return id && MEASUREMENT_ID.test(id) ? id : undefined;
}

/** The gtag.js loader and config as HTML for <head>. */
export function analyticsSnippet(id: string): string {
  return [
    `<script async src="https://www.googletagmanager.com/gtag/js?id=${id}"></script>`,
    `<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${id}');</script>`,
  ].join('\n    ');
}
