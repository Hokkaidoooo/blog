import { getCollection, type CollectionEntry } from 'astro:content';
import { publishedPosts, readingMinutes } from './journal.mjs';
import { categoryInfo, href } from './site.mjs';

export type Post = CollectionEntry<'posts'>;
const buildTime = new Date();

export async function getPosts() {
  return publishedPosts(await getCollection('posts'), buildTime);
}

export function postUrl(post: Post) {
  return href('posts/' + post.id + '/');
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'UTC',
  }).format(date).replaceAll('/', '.');
}

export function postBody(post: Post) {
  if (post.body === undefined) throw new Error('文章正文缺失：' + post.id);
  return post.body;
}

export function postMeta(post: Post) {
  return {
    date: formatDate(post.data.date),
    minutes: readingMinutes(postBody(post)),
    category: categoryInfo(post.data.category),
  };
}
