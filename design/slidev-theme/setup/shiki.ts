// Code colours for slides: the shared themes in design/shiki.ts.
import { defineShikiSetup } from '@slidev/types'
import { shikiThemes } from '../../shiki.ts'

export default defineShikiSetup(() => ({ themes: shikiThemes }))
