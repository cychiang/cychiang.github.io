// One feed for posts and decks, newest first.
import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { site } from '../site.config';

export const GET: APIRoute = async (context) => {
  const published = ({ data }: { data: { draft: boolean } }) => !data.draft;
  const [posts, decks] = await Promise.all([getCollection('posts', published), getCollection('decks', published)]);
  const base = import.meta.env.BASE_URL.replace(/\/+$/, '');
  const items = [
    ...posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: `${base}/posts/${post.id}/`,
      categories: post.data.tags,
    })),
    ...decks.map((deck) => ({
      title: `${deck.data.title} (slides)`,
      description: deck.data.description,
      pubDate: deck.data.date,
      link: `${base}/decks/${deck.id}/`,
      categories: [deck.data.type, ...deck.data.tags],
    })),
  ].sort((a, b) => b.pubDate.valueOf() - a.pubDate.valueOf());

  return rss({
    title: site.name,
    description: site.description,
    site: context.site!,
    items,
    customData: `<language>${site.language}</language>`,
  });
};
