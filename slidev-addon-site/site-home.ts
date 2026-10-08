// Where "back to the homepage" points, worked out from the deck's own base
// path so it follows the site wherever it is hosted:
//   /decks/2026-hello-world/           -> /
//   /some-repo/decks/2026-hello-world/ -> /some-repo/
const DECK_PATH = /decks\/[^/]+\/$/;
const base: string = import.meta.env.BASE_URL;

/** URL of the homepage, or '' when it cannot be known (then no link is shown). */
export const siteHome: string = DECK_PATH.test(base)
  ? base.replace(DECK_PATH, '')
  : import.meta.env.DEV
    ? 'http://localhost:4321/' // `pnpm deck` serves at /, so point at `pnpm dev`
    : '';

export const siteHomeLabel = 'All decks';
