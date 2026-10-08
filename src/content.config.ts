import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { DECK_TYPES, listDecks } from '../scripts/lib/decks.mjs';

// The `decks` collection is read straight from decks/<slug>/slides.md, so a
// deck's headmatter is the only place its title, date and type are written.
const decks = defineCollection({
  loader: async () =>
    (await listDecks()).map((deck) => ({
      id: deck.slug,
      title: deck.title,
      description: deck.description,
      date: deck.date,
      type: deck.type,
      event: deck.event,
      tags: deck.tags,
      draft: deck.draft,
      links: deck.links,
      slides: deck.slides,
    })),
  schema: z.object({
    title: z.string().min(1),
    description: z.string(),
    date: z.coerce.date(),
    type: z.enum(DECK_TYPES),
    event: z.string().optional(),
    tags: z.array(z.string()),
    draft: z.boolean(),
    links: z.record(z.string(), z.string()),
    slides: z.number().int().positive(),
  }),
});

export const collections = { decks };
