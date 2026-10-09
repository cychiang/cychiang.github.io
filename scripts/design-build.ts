// Turn design/tokens.ts into the files the site, the slide theme and the
// browser tab read.
//
//   pnpm design:build   write the generated files
//   pnpm design:check   fail if they are out of date or a colour pair is
//                       below its contrast minimum (runs in `pnpm check`)
import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { color, contrast, font, shape, text } from '../design/tokens.ts';
import type { Palette } from '../design/tokens.ts';
import { ROOT } from './lib/decks.ts';

const checkOnly = process.argv.includes('--check');
const HEADER = 'GENERATED from design/tokens.ts by `pnpm design:build`. Do not edit.';

const kebab = (name: string) => name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);

function colorVars(palette: Palette, indent: string): string {
  return Object.entries(palette)
    .map(([name, value]) => `${indent}--color-${kebab(name)}: ${value};`)
    .join('\n');
}

const sharedVars = (indent: string) =>
  [
    `--font-mono: ${font.stack};`,
    `--weight-regular: ${font.weight.regular};`,
    `--weight-strong: ${font.weight.strong};`,
    ...Object.entries(text).map(([name, value]) => `--text-${name}: ${value};`),
    `--radius: ${shape.radius};`,
    `--border: ${shape.border};`,
  ]
    .map((line) => indent + line)
    .join('\n');

/** The homepage follows the operating system's light or dark setting. */
const siteCss = `/* ${HEADER} */

:root {
  color-scheme: light dark;
${colorVars(color.light, '  ')}
${sharedVars('  ')}
}

@media (prefers-color-scheme: dark) {
  :root {
${colorVars(color.dark, '    ')}
  }
}
`;

/** Slidev switches modes with a class on <html>, from its own toggle. */
const slidevCss = `/* ${HEADER} */

:root {
${colorVars(color.light, '  ')}
${sharedVars('  ')}
}

html.dark {
${colorVars(color.dark, '  ')}
}
`;

/** A prompt chevron and a cursor. Browser tabs are small: always the dark palette.
 *  Decks get a copy of this file from scripts/build-decks.ts. */
const favicon = `<!-- ${HEADER} -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="6" fill="${color.dark.bg}"/>
  <path d="M8 11l6 5-6 5" fill="none" stroke="${color.dark.prompt}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="16.5" y="19.5" width="8" height="2.6" rx="1" fill="${color.dark.ink}"/>
</svg>
`;

const outputs: Record<string, string> = {
  'design/generated/tokens.site.css': siteCss,
  'design/generated/tokens.slidev.css': slidevCss,
  'public/favicon.svg': favicon,
};

// --- Contrast -------------------------------------------------------------

function luminance(hex: string): number {
  const channels = [1, 3, 5].map((i) => Number.parseInt(hex.slice(i, i + 2), 16) / 255);
  const [r = 0, g = 0, b = 0] = channels.map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function ratio(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
}

const problems: string[] = [];

for (const [mode, palette] of Object.entries(color)) {
  for (const [name, value] of Object.entries(palette)) {
    if (!/^#[0-9a-f]{6}$/.test(value)) problems.push(`${mode}.${name}: "${value}" must be a lowercase #rrggbb colour`);
  }
  for (const [fg, bg, minimum] of contrast) {
    const actual = ratio(palette[fg], palette[bg]);
    if (actual < minimum) {
      problems.push(`${mode}: ${fg} on ${bg} is ${actual.toFixed(2)}:1, below the ${minimum}:1 minimum`);
    }
  }
}

// --- Write or compare -----------------------------------------------------

for (const [file, content] of Object.entries(outputs)) {
  const target = path.join(ROOT, file);
  if (checkOnly) {
    const current = existsSync(target) ? await readFile(target, 'utf8') : '';
    if (current !== content) problems.push(`${file} is out of date. Run \`pnpm design:build\` and commit the result.`);
  } else {
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, content);
    console.log(`wrote ${file}`);
  }
}

if (problems.length > 0) {
  console.error('Design tokens need attention:');
  for (const problem of problems) console.error(`  - ${problem}`);
  process.exit(1);
}
console.log(checkOnly ? 'Design tokens: generated files are current, contrast passes.' : 'Design tokens built.');
