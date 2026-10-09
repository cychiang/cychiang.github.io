// Diagrams follow the same tokens as everything else. See design/mermaid.ts.
import { defineMermaidSetup } from '@slidev/types'
import { mermaidConfig, waitForFonts } from '../../mermaid.ts'

export default defineMermaidSetup(async () => {
  // Mermaid measures text while laying out; the typeface must be ready.
  await waitForFonts()
  return mermaidConfig
})
