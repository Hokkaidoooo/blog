import rss from '@astrojs/rss';
import { getPosts, postUrl } from '../lib/posts';
import { SITE, absoluteUrl } from '../lib/site.mjs';

export async function GET() {
  return rss({
    title: SITE.name,
    description: SITE.description,
    site: absoluteUrl(),
    items: (await getPosts()).map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: new URL(postUrl(post), SITE.url).href,
    })),
    customData: '<language>zh-cn</language>',
  });
}
