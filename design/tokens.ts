// The design system's single source of truth.
//
// Every colour, typeface and shape used by the homepage, the slide theme and
// the diagrams comes from this file. Nothing else in the repository may contain
// a raw colour or font name. After editing, run `pnpm design:build` and follow
// "Changing the style" in design/README.md.
//
// Run directly by Node, so erasable TypeScript only.

export interface Palette {
  /** Page and slide background. */
  bg: string;
  /** Panes, code blocks, diagram nodes: anything raised off the background. */
  surface: string;
  /** Primary text. */
  ink: string;
  /** Secondary text: comments, status lines, edge labels. */
  inkSoft: string;
  /** Pane borders, rules, diagram edges. */
  line: string;
  /** Anything that can be opened or is in focus. Blue, like a directory in `ls`. */
  accent: string;
  /** Text on an accent fill. */
  onAccent: string;
  /** The prompt and the cursor; in diagrams, the healthy path. */
  prompt: string;
  /** Warnings: drafts, degraded states, things to watch. */
  flag: string;
  /** Errors and failure paths. */
  danger: string;
}

export const color: { light: Palette; dark: Palette } = {
  light: {
    bg: '#f3f4f6',
    surface: '#fbfbfc',
    ink: '#1c2028',
    inkSoft: '#5d6673',
    line: '#cdd2da',
    accent: '#2452c9',
    onAccent: '#ffffff',
    prompt: '#1f7a3a',
    flag: '#8a6100',
    danger: '#b3261e',
  },
  dark: {
    bg: '#161a22',
    surface: '#1d222c',
    ink: '#dfe3ea',
    inkSoft: '#8b94a3',
    line: '#323a48',
    accent: '#7aa7ff',
    onAccent: '#0f131a',
    prompt: '#8fd694',
    flag: '#e6c36a',
    danger: '#ff8e84',
  },
};

export const font = {
  /** The one typeface. Loaded from @fontsource in design/fonts.css. The
   *  "Variable" suffix is the family name fontsource registers. */
  family: 'JetBrains Mono Variable',
  /** Full stack, with system monospace fallbacks. */
  stack: "'JetBrains Mono Variable', 'JetBrains Mono', ui-monospace, 'SF Mono', Menlo, Consolas, monospace",
  /** Only two weights exist in this system. */
  weight: { regular: 400, strong: 600 },
};

/** Type scale for the homepage (rem). Slides have their own scale in the theme. */
export const text = {
  xs: '0.75rem', // pane bars, status lines
  sm: '0.8125rem', // comments, notes, output
  // Body: 15px on a phone, 16px from a tablet up. The reading column is set
  // in ch, so it grows with the type and stays under 80 characters.
  base: 'clamp(0.9375rem, 0.875rem + 0.3vw, 1rem)',
};

export const shape = {
  /** Corner radius of panes, buttons, code blocks and diagram nodes. */
  radius: '4px',
  /** Every border and diagram line. */
  border: '1px',
};

/** The shell prompt, shown on the homepage and on deck covers. */
export const prompt = { user: 'cychiang', host: 'github.io' };

/**
 * Minimum WCAG contrast ratios, checked by `pnpm design:check` in both modes.
 * Each entry is [foreground, background, minimum].
 */
export const contrast: [keyof Palette, keyof Palette, number][] = [
  ['ink', 'bg', 7],
  ['ink', 'surface', 7],
  ['inkSoft', 'bg', 4.5],
  ['inkSoft', 'surface', 4.5],
  ['accent', 'bg', 4.5],
  ['accent', 'surface', 4.5],
  ['onAccent', 'accent', 4.5],
  ['prompt', 'bg', 4.5],
  ['prompt', 'surface', 4.5],
  ['flag', 'bg', 4.5],
  ['flag', 'surface', 4.5],
  ['danger', 'bg', 4.5],
  ['danger', 'surface', 4.5],
];
