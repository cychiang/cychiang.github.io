// Open Graph images, drawn from the design tokens: a dark terminal pane with
// the prompt line that opens the page, the title, and a status line. Built
// at build time for the homepage, every post and every deck.
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';
import { Resvg } from '@resvg/resvg-js';
import satori from 'satori';
import { color, font, prompt } from '../../design/tokens.ts';

export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;

export interface OgCard {
  /** The command on the prompt line, e.g. "open 2026-hello-world". */
  command: string;
  title: string;
  /** Second line under the title; kept to one sentence. */
  subtitle?: string;
  /** Left side of the status line, one or more parts. */
  status: string[];
  /** Right side of the status line, e.g. a date. */
  statusRight?: string;
}

const require = createRequire(import.meta.url);
const fontDir = path.join(path.dirname(require.resolve('@fontsource/jetbrains-mono/package.json')), 'files');

let fonts: { name: string; data: Buffer; weight: 400 | 600; style: 'normal' }[] | undefined;
async function loadFonts() {
  fonts ??= await Promise.all(
    ([400, 600] as const).map(async (weight) => ({
      name: font.family,
      data: await readFile(path.join(fontDir, `jetbrains-mono-latin-${weight}-normal.woff`)),
      weight,
      style: 'normal' as const,
    })),
  );
  return fonts;
}

const p = color.dark;

/** Satori takes React-like element objects; no JSX needed. */
const h = (type: string, style: Record<string, unknown>, children?: unknown) => ({
  type,
  props: { style, children },
});

export async function renderOg(card: OgCard): Promise<Buffer> {
  const titleSize = card.title.length > 40 ? 52 : card.title.length > 24 ? 64 : 76;
  const tree = h(
    'div',
    {
      width: OG_WIDTH,
      height: OG_HEIGHT,
      display: 'flex',
      flexDirection: 'column',
      background: p.bg,
      color: p.ink,
      fontFamily: font.family,
    },
    [
      h('div', { display: 'flex', fontSize: 26, color: p.inkSoft, padding: '56px 64px 0' }, [
        h('span', { color: p.prompt }, `${prompt.user}@${prompt.host}`),
        h('span', { color: p.accent }, ':~'),
        h('span', { color: p.inkSoft, marginRight: 14 }, '$'),
        h('span', { color: p.ink }, card.command),
      ]),
      h(
        'div',
        { display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, justifyContent: 'flex-end', padding: '0 64px 44px' },
        [
          // Words wrap as a flex row with the cursor block as the last item,
          // so the cursor follows the last word even when the title wraps.
          h(
            'div',
            { display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', fontSize: titleSize, fontWeight: 600, lineHeight: 1.08, letterSpacing: -2, maxWidth: 1072 },
            [
              ...card.title.split(/\s+/).map((word) => h('span', { marginRight: titleSize * 0.6 }, word)),
              h('div', { width: titleSize * 0.5, height: titleSize * 0.82, marginBottom: titleSize * 0.1, background: p.prompt }),
            ],
          ),
          card.subtitle
            ? h('div', { marginTop: 22, fontSize: 28, color: p.inkSoft, lineHeight: 1.4, maxWidth: 1040 }, card.subtitle)
            : undefined,
        ],
      ),
      h(
        'div',
        {
          display: 'flex',
          flexShrink: 0,
          justifyContent: 'space-between',
          padding: '0 64px',
          height: 56,
          alignItems: 'center',
          borderTop: `2px solid ${p.line}`,
          color: p.inkSoft,
          fontSize: 22,
        },
        [
          h('div', { display: 'flex' }, card.status.map((part) => h('span', { marginRight: 40 }, part))),
          h('span', {}, card.statusRight ?? ''),
        ],
      ),
    ],
  );

  const svg = await satori(tree as any, { width: OG_WIDTH, height: OG_HEIGHT, fonts: await loadFonts() });
  return new Resvg(svg, { fitTo: { mode: 'width', value: OG_WIDTH } }).render().asPng();
}
