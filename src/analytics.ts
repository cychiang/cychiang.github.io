// GoatCounter: cookieless, privacy-friendly page views. Off unless
// GOATCOUNTER_CODE (the site code, the part before .goatcounter.com) is set at
// build time; the deploy workflow sets it from a repository variable, so local
// builds, previews and pull requests send nothing. Shared by Base.astro and
// scripts/build-decks.ts.

const SITE_CODE = /^[a-z0-9][a-z0-9-]{1,30}$/;

/** The configured site code, or undefined when analytics is off or malformed. */
export function goatcounterCode(env: Record<string, string | undefined>): string | undefined {
  const code = env.GOATCOUNTER_CODE?.trim();
  return code && SITE_CODE.test(code) ? code : undefined;
}

/** The GoatCounter script tag as HTML for <head>. */
export function analyticsSnippet(code: string): string {
  return `<script data-goatcounter="https://${code}.goatcounter.com/count" async src="https://gc.zgo.at/count.js"></script>`;
}
