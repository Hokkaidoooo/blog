export const SITE = Object.freeze({
  name: 'Hokkaido · 手记',
  author: 'Hokkaido',
  description: '关于计算机、学习与日常。把值得记下的事，留在这里。',
  url: 'https://hokkaidoooo.github.io',
  base: '/blog/',
  portfolio: 'https://hokkaidoooo.github.io/',
  github: 'https://github.com/Hokkaidoooo',
});

export const CATEGORIES = Object.freeze([
  { id: 'learning', name: '学习笔记', english: 'Learning', description: '从一个问题出发，直到把它弄明白。', number: '01' },
  { id: 'life', name: '生活随笔', english: 'Living', description: '留意日常，也给想法一点空白。', number: '02' },
  { id: 'creating', name: '内容创作', english: 'Creating', description: '让零散的想法，成为清楚的表达。', number: '03' },
]);

export const COVERS = Object.freeze([
  { id: 'http', file: 'http.svg', alt: '一段 HTTP 请求与响应的示意' },
  { id: 'cache', file: 'cache.svg', alt: 'Cache 访问序列 0、4、0、4 的示意' },
  { id: 'io', file: 'io.svg', alt: '四层 I/O 软件与硬件之间的请求和中断示意' },
  { id: 'mle', file: 'mle.svg', alt: '并联系统、四套试验结果与极大似然估计不变性的示意' },
  { id: 'integral', file: 'integral.svg', alt: '曲边梯形面积与矩形、三角形、梯形三种估算模型的示意' },
  { id: 'pagefault', file: 'pagefault.svg', alt: '页表有效位为 0 触发调页与缺页处理四步流程的示意' },
  { id: 'writing', file: 'writing.jpg', alt: '钢笔笔尖落在写有文字的纸页上' },
]);

/** @param {string} [path] */
export function href(path = '') {
  return SITE.base + path.replace(/^\/+/, '');
}

/** @param {string} [path] */
export function absoluteUrl(path = '') {
  return new URL(href(path), SITE.url).href;
}

/** @param {string} id */
export function categoryInfo(id) {
  const category = CATEGORIES.find((item) => item.id === id);
  if (!category) throw new Error('未知文章分类：' + id);
  return category;
}

/** @param {string} id */
export function coverInfo(id) {
  const cover = COVERS.find((item) => item.id === id);
  if (!cover) throw new Error('未知文章配图：' + id);
  return { src: href('images/' + cover.file), alt: cover.alt };
}
