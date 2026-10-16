import { test, expect, type Page, type APIRequestContext } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { CATEGORIES, SITE, href } from '../../src/lib/site.mjs';

const evidence = resolve(process.env.BLOG_QA_DIR ?? 'test-results/site');
mkdirSync(evidence, { recursive: true });
const articlePath = href('posts/http-request-to-response/');

async function checkLayout(page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  for (const image of await page.locator('img').all()) {
    await image.scrollIntoViewIfNeeded();
    await expect.poll(() => image.evaluate((element) => element instanceof HTMLImageElement && element.complete && element.naturalWidth > 0)).toBe(true);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
}

async function publicPostCount(request: APIRequestContext) {
  const response = await request.get(href('search.json'));
  expect(response.status()).toBe(200);
  const posts: unknown[] = await response.json();
  return posts.length;
}

async function checkAccessibility(page: Page) {
  const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  expect(result.violations.map((item) => ({
    id: item.id,
    impact: item.impact,
    elements: item.nodes.map((node) => ({ target: node.target, reason: node.failureSummary })),
  }))).toEqual([]);
}

test('每个公开页面、内部入口与图片均可真实访问', async ({ page, request }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  const indexResponse = await request.get(href('search.json'));
  expect(indexResponse.status()).toBe(200);
  const posts: { url: string }[] = await indexResponse.json();
  const pages = [href(), href('archive/'), href('about/'), ...CATEGORIES.map((item) => href('category/' + item.id + '/')), ...posts.map((item) => item.url)];
  const targets = new Set<string>();
  for (const path of pages) {
    const response = await page.goto(path, { waitUntil: 'networkidle' });
    expect(response?.status(), path).toBe(200);
    await expect(page.locator('main h1')).toHaveCount(1);
    await checkLayout(page);
    const links = await page.locator('a[href], link[rel="stylesheet"], script[src], img[src]').evaluateAll((nodes) => nodes.map((node) => node.getAttribute('href') ?? node.getAttribute('src')).filter((value): value is string => value !== null));
    for (const link of links) {
      const url = new URL(link, page.url());
      if (url.origin !== new URL(page.url()).origin) continue;
      if (url.hash && url.pathname === new URL(page.url()).pathname) {
        expect(await page.locator('[id]').evaluateAll((nodes, id) => nodes.some((node) => node.id === id), decodeURIComponent(url.hash.slice(1))), link).toBe(true);
      }
      url.hash = '';
      targets.add(url.href);
    }
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    expect(canonical).toBe(SITE.url + path);
  }
  for (const target of targets) expect((await request.get(target)).status(), target).toBe(200);
  expect(errors).toEqual([]);
});

test('电脑首页排版与可访问性', async ({ page }) => {
  await page.goto(href(), { waitUntil: 'networkidle' });
  await checkLayout(page);
  await checkAccessibility(page);
  await page.screenshot({ path: resolve(evidence, '首页-电脑.png'), fullPage: true });
  await page.getByRole('link', { name: '开始阅读', exact: true }).click();
  await expect(page).toHaveURL(/#latest$/);
});

test('手机与窄屏首页、分类入口可用', async ({ page }) => {
  for (const width of [390, 320]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto(href(), { waitUntil: 'networkidle' });
    await checkLayout(page);
    await expect(page.getByRole('button', { name: '搜索文章', exact: true })).toBeVisible();
    if (width === 390) {
      await checkAccessibility(page);
      await page.screenshot({ path: resolve(evidence, '首页-手机.png'), fullPage: true });
    }
  }
  await page.locator('.topic-tile').filter({ hasText: '生活随笔' }).click();
  await expect(page.getByText('还没有公开的生活随笔。', { exact: true })).toBeVisible();
  await checkLayout(page);
});

test('文章目录、阅读进度和复制链接', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto(articlePath, { waitUntil: 'networkidle' });
  await checkAccessibility(page);
  await checkLayout(page);
  await page.screenshot({ path: resolve(evidence, '文章-电脑.png'), fullPage: true });
  const firstHeading = page.locator('.toc-sticky ol a').first();
  const fragment = await firstHeading.getAttribute('href');
  await firstHeading.click();
  await expect.poll(() => decodeURIComponent(new URL(page.url()).hash)).toBe(fragment);
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await expect.poll(() => page.locator('progress').evaluate((element) => (element as HTMLProgressElement).value)).toBe(100);
  await page.getByRole('button', { name: '复制文章链接' }).click();
  await expect(page.getByText('链接已复制。', { exact: true })).toBeVisible();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe('http://127.0.0.1:4321' + articlePath);
});

test('手机文章正文、代码和目录不溢出', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(articlePath, { waitUntil: 'networkidle' });
  await checkLayout(page);
  await checkAccessibility(page);
  await page.screenshot({ path: resolve(evidence, '文章-手机.png'), fullPage: true });
  await expect(page.locator('.toc-sticky')).toBeVisible();
});

test('搜索支持中文、全角英文、空结果及键盘关闭', async ({ page, request }) => {
  const total = await publicPostCount(request);
  await page.goto(href(), { waitUntil: 'networkidle' });
  const trigger = page.getByRole('button', { name: '搜索文章', exact: true });
  await trigger.click();
  await expect(page.locator('.search-results li')).toHaveCount(total);
  await page.getByRole('searchbox').fill('ＨＴＴＰ');
  await expect(page.locator('.search-results')).toContainText('一次 HTTP 请求');
  await expect(page.locator('.search-results')).not.toContainText('Cache 没命中');
  await checkAccessibility(page);
  await page.screenshot({ path: resolve(evidence, '搜索-电脑.png') });
  await page.getByRole('searchbox').fill('影子 Cache');
  await expect(page.locator('.search-results')).toContainText('Cache 没命中');
  await page.getByRole('searchbox').fill('<img src=x onerror=alert(1)>');
  await expect(page.locator('.search-results li')).toHaveCount(0);
  await expect(page.locator('.search-status')).toContainText('没有找到相关内容');
  await page.keyboard.press('Escape');
  await expect(page.locator('dialog')).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await page.keyboard.press('/');
  await expect(page.getByRole('searchbox')).toBeFocused();
  await page.getByRole('searchbox').fill('LRU');
  await page.locator('.search-results a').filter({ hasText: 'Cache 没命中' }).click();
  await expect(page).toHaveURL(/\/posts\/cache-miss-types\/$/);
});

for (const failure of ['http', 'broken'] as const) {
  test('搜索索引失败可见且可重试：' + failure, async ({ page, request }) => {
    const total = await publicPostCount(request);
    let requests = 0;
    const runtimeErrors: string[] = [];
    const reportedErrors: string[] = [];
    page.on('pageerror', (error) => runtimeErrors.push(error.message));
    page.on('console', (message) => { if (message.type() === 'error') reportedErrors.push(message.text()); });
    await page.route('**' + href('search.json'), async (route) => {
      requests += 1;
      if (requests > 1) return route.continue();
      await route.fulfill({ status: failure === 'http' ? 503 : 200, contentType: 'application/json', body: failure === 'http' ? '{}' : '[null]' });
    });
    await page.goto(href());
    await page.getByRole('button', { name: '搜索文章', exact: true }).click();
    await expect(page.locator('.search-status')).toContainText('暂时无法读取');
    await page.getByRole('button', { name: '重新加载文章' }).click();
    await expect(page.locator('.search-results li')).toHaveCount(total);
    expect(requests).toBe(2);
    expect(reportedErrors.some((message) => message.includes('文章搜索加载失败'))).toBe(true);
    expect(runtimeErrors).toEqual([]);
  });
}

test('关闭 JavaScript 仍可阅读和导航', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    await page.goto('http://127.0.0.1:4321' + articlePath);
    await expect(page.locator('.article-body h2')).toHaveCount(4);
    await expect(page.getByRole('button', { name: '搜索文章', exact: true })).toBeHidden();
    await expect(page.locator('#copy-link')).toBeHidden();
    await page.getByRole('link', { name: '全部文章', exact: true }).first().click();
    await expect(page).toHaveURL(/\/archive\/$/);
  } finally {
    await context.close();
  }
});

test('RSS、站点地图和 404 返回真实内容', async ({ request }) => {
  const rss = await request.get(href('rss.xml'));
  expect(rss.status()).toBe(200);
  expect(await rss.text()).toContain('<language>zh-cn</language>');
  expect(await rss.text()).toContain(SITE.url + articlePath);
  const sitemap = await request.get(href('sitemap-0.xml'));
  expect(sitemap.status()).toBe(200);
  expect(await sitemap.text()).toContain(SITE.url + articlePath);
  const missing = await request.get(href('this-page-does-not-exist/'));
  expect(missing.status()).toBe(404);
  expect(await missing.text()).toContain('这一页，似乎走丢了。');
});
