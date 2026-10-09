// Mermaid configuration for the whole system: slides today, articles later.
//
// Mermaid is themed with CSS custom properties rather than fixed colours, so
// one configuration follows the light and dark palettes and any later change
// to design/tokens.ts. Nodes are panes, edges are hairlines, and the only
// colours are the semantic classes below.
import type { MermaidConfig } from 'mermaid';
import { color, font, shape } from './tokens.ts';

// Semantic node classes (`:::focus`, `:::ok`, `:::warn`, `:::fail`, `:::ext`,
// `:::store`) are styled below and documented in design/README.md.

const c = (name: string) => `var(--color-${name})`;

/** Styles injected into every rendered SVG. */
const themeCSS = `
  svg { font-family: ${font.stack} !important; max-width: none !important; width: 100% !important; height: 100% !important; }
  text, tspan, .label, .nodeLabel, .edgeLabel, .cluster-label, .messageText, .noteText,
  .actor > tspan, .labelText, .loopText, .sectionTitle, .titleText, .legend {
    font-family: ${font.stack} !important;
    fill: ${c('ink')} !important;
    color: ${c('ink')} !important;
  }

  /* flowchart nodes are panes */
  .node rect, .node circle, .node ellipse, .node polygon, .node path, .node .label-container,
  .basic.label-container {
    fill: ${c('surface')} !important;
    stroke: ${c('line')} !important;
    stroke-width: ${shape.border} !important;
    rx: 4px; ry: 4px;
  }
  .node.focus rect, .node.focus circle, .node.focus polygon, .node.focus path, .node.focus .label-container { stroke: ${c('accent')} !important; }
  .node.focus .nodeLabel, .node.focus text { fill: ${c('accent')} !important; color: ${c('accent')} !important; }
  .node.ok rect, .node.ok circle, .node.ok polygon, .node.ok path, .node.ok .label-container { stroke: ${c('prompt')} !important; }
  .node.ok .nodeLabel, .node.ok text { fill: ${c('prompt')} !important; color: ${c('prompt')} !important; }
  .node.warn rect, .node.warn circle, .node.warn polygon, .node.warn path, .node.warn .label-container { stroke: ${c('flag')} !important; }
  .node.warn .nodeLabel, .node.warn text { fill: ${c('flag')} !important; color: ${c('flag')} !important; }
  .node.fail rect, .node.fail circle, .node.fail polygon, .node.fail path, .node.fail .label-container { stroke: ${c('danger')} !important; }
  .node.fail .nodeLabel, .node.fail text { fill: ${c('danger')} !important; color: ${c('danger')} !important; }
  .node.ext rect, .node.ext circle, .node.ext polygon, .node.ext path, .node.ext .label-container { stroke-dasharray: 4 3; fill: transparent !important; }
  .node.ext .nodeLabel, .node.ext text { fill: ${c('ink-soft')} !important; color: ${c('ink-soft')} !important; }
  .node.store rect, .node.store circle, .node.store polygon, .node.store path, .node.store .label-container { stroke: ${c('ink-soft')} !important; stroke-width: 2px !important; }

  /* edges are hairlines, labels sit on the background */
  .edgePath .path, .flowchart-link, path.transition, .relation, .messageLine0, .messageLine1, .actor-line, .loopLine, line {
    stroke: ${c('ink-soft')} !important;
    stroke-width: ${shape.border} !important;
  }
  .messageLine1, .edge-pattern-dotted, .edge-pattern-dashed { stroke-dasharray: 4 3 !important; }
  .edge-thickness-thick { stroke-width: 2px !important; }
  marker path, .arrowheadPath, .arrowMarkerPath { fill: ${c('ink-soft')} !important; stroke: ${c('ink-soft')} !important; }
  .edgeLabel, .edgeLabel rect, .edgeLabel .labelBkg, .labelBkg { background: ${c('bg')} !important; fill: ${c('bg')} !important; opacity: 1 !important; }
  .edgeLabel, .edgeLabel .edgeLabel, .edgeLabel span, .edgeLabel p { color: ${c('ink-soft')} !important; background: ${c('bg')} !important; }

  /* clusters and groups are larger panes */
  .cluster rect, .cluster-label rect, .statediagram-cluster rect, .cluster path, g.cluster > rect, .stateGroup rect, .legend rect {
    fill: ${c('bg')} !important;
    stroke: ${c('line')} !important;
    stroke-width: ${shape.border} !important;
    rx: 4px; ry: 4px;
  }
  .cluster-label text, .cluster-label span, .cluster-label p { fill: ${c('ink-soft')} !important; color: ${c('ink-soft')} !important; }

  /* sequence diagrams */
  rect.actor, .actor, .actor-box { fill: ${c('surface')} !important; stroke: ${c('line')} !important; stroke-width: ${shape.border} !important; rx: 4px; ry: 4px; }
  .actor-man circle, .actor-man line { stroke: ${c('line')} !important; fill: ${c('surface')} !important; }
  .activation0, .activation1, .activation2 { fill: ${c('bg')} !important; stroke: ${c('ink-soft')} !important; stroke-width: ${shape.border} !important; }
  .note, .note rect { fill: ${c('bg')} !important; stroke: ${c('flag')} !important; stroke-width: ${shape.border} !important; rx: 4px; ry: 4px; }
  .noteText, .noteText tspan { fill: ${c('ink-soft')} !important; }
  .labelBox { fill: ${c('bg')} !important; stroke: ${c('line')} !important; }
  .labelText, .labelText tspan { fill: ${c('ink-soft')} !important; }
  .loopText, .loopText tspan { fill: ${c('ink-soft')} !important; }
  .sequenceNumber { fill: ${c('on-accent')} !important; }
  .messageText { fill: ${c('ink')} !important; stroke: none !important; }

  /* state diagrams */
  .statediagram-state rect, .statediagram-state .label-container, .stateGroup .state-title { fill: ${c('surface')} !important; stroke: ${c('line')} !important; }
  .statediagram-state rect.divider { fill: transparent !important; stroke: ${c('line')} !important; }
  .start-state circle, .state-start circle, .node circle.state-start, .node circle.state-end { fill: ${c('ink-soft')} !important; stroke: ${c('ink-soft')} !important; }
  .node .fork-join { fill: ${c('ink-soft')} !important; stroke: ${c('ink-soft')} !important; }
  .stateLabel text, .stateLabel .label { fill: ${c('ink')} !important; }
`;

export const mermaidConfig: MermaidConfig = {
  theme: 'base',
  fontFamily: font.stack,
  themeVariables: {
    fontFamily: font.stack,
    fontSize: '15px',
    // Baseline values; themeCSS above does the real work in both modes.
    primaryColor: color.light.surface,
    primaryTextColor: color.light.ink,
    primaryBorderColor: color.light.line,
    lineColor: color.light.inkSoft,
    secondaryColor: color.light.bg,
    tertiaryColor: color.light.bg,
    background: color.light.bg,
    noteBkgColor: color.light.bg,
    noteBorderColor: color.light.flag,
  },
  themeCSS,
  flowchart: {
    htmlLabels: true,
    // Mermaid 12 draws orthogonal edges with small rounded corners by default,
    // which matches the pane radius; `curve` is left alone on purpose.
    nodeSpacing: 36,
    rankSpacing: 48,
    padding: 10,
    diagramPadding: 4,
  },
  sequence: {
    diagramMarginX: 8,
    diagramMarginY: 8,
    actorMargin: 48,
    boxMargin: 8,
    messageMargin: 36,
    mirrorActors: false,
    showSequenceNumbers: false,
  },
  state: {
    nodeSpacing: 36,
    rankSpacing: 48,
  },
};

/** Resolve once the system typeface can be measured. */
export async function waitForFonts(): Promise<void> {
  if (typeof document === 'undefined' || !('fonts' in document)) return;
  await Promise.all([
    document.fonts.load(`${font.weight.regular} 16px "${font.family}"`),
    document.fonts.load(`${font.weight.strong} 16px "${font.family}"`),
  ]).catch(() => undefined);
}
