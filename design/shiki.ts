// Syntax colours for code blocks, from the design tokens. Used by the slide
// theme (Slidev's Shiki setup) and by the homepage's Markdown (Astro's
// Shiki). Colour carries the same meaning as everywhere else: strings are
// prompt-green (literal text), keywords accent-blue (structure), numbers and
// constants flag-yellow, comments soft, mistakes danger-red.
import { color } from './tokens.ts';
import type { Palette } from './tokens.ts';

export function terminalTheme(name: string, type: 'light' | 'dark', p: Palette) {
  return {
    name,
    type,
    colors: {
      'editor.background': p.surface,
      'editor.foreground': p.ink,
    },
    tokenColors: [
      { scope: ['comment', 'punctuation.definition.comment'], settings: { foreground: p.inkSoft, fontStyle: 'italic' } },
      { scope: ['string', 'string.quoted', 'string.template', 'constant.character', 'markup.inserted'], settings: { foreground: p.prompt } },
      { scope: ['keyword', 'storage', 'storage.type', 'storage.modifier', 'keyword.control', 'keyword.operator.new', 'keyword.operator.expression'], settings: { foreground: p.accent } },
      { scope: ['constant.numeric', 'constant.language', 'support.constant', 'variable.other.constant', 'constant.other'], settings: { foreground: p.flag } },
      { scope: ['punctuation', 'meta.brace', 'keyword.operator'], settings: { foreground: p.inkSoft } },
      { scope: ['entity.name.tag', 'entity.other.attribute-name', 'support.type.property-name', 'meta.object-literal.key'], settings: { foreground: p.ink } },
      { scope: ['entity.name.function', 'support.function', 'entity.name.type', 'entity.name.class', 'support.class', 'support.type'], settings: { foreground: p.ink } },
      { scope: ['variable', 'variable.parameter', 'meta.definition.variable'], settings: { foreground: p.ink } },
      { scope: ['invalid', 'markup.deleted'], settings: { foreground: p.danger } },
      { scope: ['markup.heading', 'markup.bold'], settings: { foreground: p.ink, fontStyle: 'bold' } },
      { scope: ['markup.italic'], settings: { fontStyle: 'italic' } },
    ],
  };
}

export const shikiThemes = {
  light: terminalTheme('terminal-light', 'light', color.light),
  dark: terminalTheme('terminal-dark', 'dark', color.dark),
};
