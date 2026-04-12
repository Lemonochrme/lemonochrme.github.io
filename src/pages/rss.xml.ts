import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context: { site: URL }) {
  const posts = await getCollection('posts');
  posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
  return rss({
    title: 'Lemonochrome - Portfolio',
    description: 'Robin Marin-Muller portfolio and blog',
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description,
      link: `/posts/${post.slug}/`,
    })),
  });
}
