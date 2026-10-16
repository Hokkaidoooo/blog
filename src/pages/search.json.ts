import { getPosts, postBody, postMeta, postUrl } from '../lib/posts';
import { searchableBody } from '../lib/journal.mjs';

export async function GET() {
  const items = (await getPosts()).map((post) => ({
    title: post.data.title,
    description: post.data.description,
    tags: post.data.tags,
    body: searchableBody(postBody(post)),
    url: postUrl(post),
    category: postMeta(post).category.name,
    date: postMeta(post).date,
  }));
  return new Response(JSON.stringify(items), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}
