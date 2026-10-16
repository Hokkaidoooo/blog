/** @param {string} text */
export function readingMinutes(text) {
  const han = text.match(/\p{Script=Han}/gu)?.length ?? 0;
  const words = text.match(/[A-Za-z0-9]+(?:['-][A-Za-z0-9]+)*/g)?.length ?? 0;
  return Math.max(1, Math.ceil(han / 300 + words / 220));
}

/** @param {string} text */
export function normalizeQuery(text) {
  return text.normalize('NFKC').toLocaleLowerCase('zh-CN').trim();
}

/** @param {string} markdown */
export function searchableBody(markdown) {
  // 参考网址不属于文章语义，避免每篇含 https 链接的文章都命中 HTTP。
  return markdown.replace(/https?:\/\/[^\s<>()\[\]"']+/giu, '');
}

/**
 * @typedef {{ title: string, description: string, tags: string[], body: string, url: string, category: string, date: string }} SearchPost
 */

/**
 * @param {unknown} data
 * @param {string} postPrefix
 * @returns {SearchPost[]}
 */
export function parseSearchIndex(data, postPrefix) {
  if (!Array.isArray(data)) throw new Error('搜索索引格式无效');
  const fields = ['title', 'description', 'body', 'url', 'category', 'date'];
  for (const item of data) {
    if (!item || typeof item !== 'object') throw new Error('搜索索引包含无效记录');
    const validText = fields.every((field) => typeof item[field] === 'string');
    const validTags = Array.isArray(item.tags) && item.tags.every((/** @type {unknown} */ tag) => typeof tag === 'string');
    if (!validText || !validTags || !item.url.startsWith(postPrefix)) {
      throw new Error('搜索索引字段不完整或文章地址无效');
    }
  }
  return data;
}

/**
 * @template {{ title: string, description: string, tags: string[], body: string }} T
 * @param {T[]} posts
 * @param {string} query
 * @returns {T[]}
 */
export function searchPosts(posts, query) {
  const terms = normalizeQuery(query).split(/\s+/u).filter(Boolean);
  if (!terms.length) return posts;
  return posts.filter((post) => {
    const haystack = normalizeQuery([post.title, post.description, ...post.tags, post.body].join(' '));
    return terms.every((term) => haystack.includes(term));
  });
}

/**
 * @template {{ id: string, data: { draft: boolean, date: Date } }} T
 * @param {T[]} posts
 * @param {Date} now
 * @returns {T[]}
 */
export function publishedPosts(posts, now) {
  if (Number.isNaN(now.getTime())) throw new Error('文章构建时间无效');
  return posts
    .filter((post) => !post.data.draft && post.data.date <= now)
    .toSorted((a, b) => b.data.date.getTime() - a.data.date.getTime() || a.id.localeCompare(b.id));
}
