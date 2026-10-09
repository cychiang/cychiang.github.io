// What a prompt line says, and where each part comes from.
//
// Precedence, highest first:
//   1. the slide's frontmatter   prompt: { user, host, path, command } or prompt: false
//   2. the deck's headmatter     themeConfig: { prompt: { user, host, path } }
//   3. design/tokens.ts          prompt.user and prompt.host
//
// `path` defaults to "~". `command` is only used by the cover; the <Prompt>
// component takes its command from its slot.
import { prompt as tokenPrompt } from '../tokens.ts'

export interface PromptParts {
  user?: string
  host?: string
  path?: string
  command?: string
}

export type PromptOverride = PromptParts | string | false | undefined

export interface ResolvedPrompt {
  user: string
  host: string
  path: string
  command?: string
}

/** Resolve the parts of a prompt from the layers above. */
export function resolvePrompt(slide: PromptOverride, deck: PromptParts | undefined): ResolvedPrompt | null {
  if (slide === false) return null
  // A plain string is a shorthand for the command alone.
  const own: PromptParts = typeof slide === 'string' ? { command: slide } : slide ?? {}
  return {
    user: own.user ?? deck?.user ?? tokenPrompt.user,
    host: own.host ?? deck?.host ?? tokenPrompt.host,
    path: own.path ?? deck?.path ?? '~',
    command: own.command ?? deck?.command,
  }
}

/** The deck-wide prompt settings from the headmatter, if any. */
export function deckPrompt(configs: { themeConfig?: Record<string, unknown> } | undefined): PromptParts | undefined {
  const value = configs?.themeConfig?.prompt
  return value && typeof value === 'object' ? (value as PromptParts) : undefined
}
