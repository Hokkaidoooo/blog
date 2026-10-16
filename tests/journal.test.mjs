import test from 'node:test';
import assert from 'node:assert/strict';
import { parseSearchIndex, publishedPosts, readingMinutes, searchableBody, searchPosts } from '../src/lib/journal.mjs';
import { absoluteUrl, categoryInfo, coverInfo, href } from '../src/lib/site.mjs';

const searchable = [
  { title: 'HTTP 请求如何分段到达', description: '字节流与请求边界', tags: ['C++'], body: '完整正文之后才能处理请求。' },
  { title: 'Cache 的三种缺失', description: '用访问序列理解缓存', tags: ['LRU'], body: '同容量全相联影子缓存用于区分冲突缺失。' },
  { title: '写作练习', description: '清楚地解释一个问题', tags: ['内容创作'], body: '从读者的问题开始。' },
];

test('搜索涵盖正文和标签，并统一全角字符与大小写', () => {
  assert.deepEqual(searchPosts(searchable, 'ＨＴＴＰ'), [searchable[0]]);
  assert.deepEqual(searchPosts(searchable, '影子缓存'), [searchable[1]]);
  assert.deepEqual(searchPosts(searchable, 'c++'), [searchable[0]]);
});

test('多个词必须同时匹配，空查询保留文章顺序', () => {
  assert.deepEqual(searchPosts(searchable, 'Cache 冲突'), [searchable[1]]);
  assert.deepEqual(searchPosts(searchable, 'HTTP 写作'), []);
  assert.deepEqual(searchPosts(searchable, '  '), searchable);
  assert.deepEqual(searchPosts(searchable, '<script>alert(1)</script>'), []);
});

test('参考网址不会污染正文搜索，可见的概念和链接标签仍可检索', () => {
  const body = searchableBody('讨论 Cache。[模型说明](https://example.com/http) https://example.com/HTTP');
  assert.ok(body.includes('Cache'));
  assert.ok(body.includes('模型说明'));
  assert.equal(searchPosts([{ title: '缓存', description: '模型', tags: ['Cache'], body }], 'HTTP').length, 0);
  assert.equal(searchableBody('HTTP 请求使用字节流。'), 'HTTP 请求使用字节流。');
});

test('公开集合同时排除草稿和未来文章，且不修改源集合', () => {
  /** @param {string} id @param {string} date @param {boolean} [draft] */
  const post = (id, date, draft = false) => ({ id, data: { date: new Date(date), draft } });
  const source = [
    post('older', '2026-10-14'),
    post('draft', '2026-10-15', true),
    post('future', '2026-10-17'),
    post('today', '2026-10-16'),
  ];
  const originalIds = source.map((item) => item.id);
  const result = publishedPosts(source, new Date('2026-10-16T08:00:00Z'));
  assert.deepEqual(result.map((item) => item.id), ['today', 'older']);
  assert.deepEqual(source.map((item) => item.id), originalIds);
  assert.throws(() => publishedPosts(source, new Date('bad date')), /构建时间无效/);
});

test('相同日期按稳定标识排序，发布日期边界包含当天零时', () => {
  const source = ['z', 'a'].map((id) => ({ id, data: { date: new Date('2026-10-16'), draft: false } }));
  assert.deepEqual(publishedPosts(source, new Date('2026-10-16')).map((item) => item.id), ['a', 'z']);
});

test('阅读时间兼容中文、英文和混合内容', () => {
  assert.equal(readingMinutes('字'.repeat(600)), 2);
  assert.equal(readingMinutes('word '.repeat(440)), 2);
  assert.equal(readingMinutes('字'.repeat(300) + 'word '.repeat(220)), 2);
  assert.equal(readingMinutes('一句话。'), 1);
});

test('内部入口、图片与订阅共用博客 base，未知分类和配图显式失败', () => {
  assert.equal(href('posts/example/'), '/blog/posts/example/');
  assert.equal(href('/archive/'), '/blog/archive/');
  assert.equal(absoluteUrl('rss.xml'), 'https://hokkaidoooo.github.io/blog/rss.xml');
  assert.equal(categoryInfo('life').name, '生活随笔');
  assert.equal(coverInfo('cache').src, '/blog/images/cache.svg');
  assert.throws(() => categoryInfo('missing'), /未知文章分类/);
  assert.throws(() => coverInfo('missing'), /未知文章配图/);
});

test('搜索索引损坏时明确拒绝，不把不完整记录或外部地址当成文章', () => {
  const valid = [{ ...searchable[0], url: '/blog/posts/http/', category: '学习笔记', date: '2026.10.16' }];
  assert.deepEqual(parseSearchIndex(valid, '/blog/posts/'), valid);
  assert.deepEqual(parseSearchIndex([], '/blog/posts/'), []);
  for (const invalid of [{}, [null], [{}], [{ ...valid[0], tags: 'HTTP' }], [{ ...valid[0], url: 'javascript:alert(1)' }]]) {
    assert.throws(() => parseSearchIndex(invalid, '/blog/posts/'), /搜索索引/);
  }
});
