import { parseSearchIndex, searchPosts, type SearchPost } from '../lib/journal.mjs';
import { href } from '../lib/site.mjs';

const dialog = document.querySelector<HTMLDialogElement>('#search-dialog')!;
const input = dialog.querySelector<HTMLInputElement>('#site-search')!;
const status = dialog.querySelector<HTMLElement>('.search-status')!;
const results = dialog.querySelector<HTMLUListElement>('.search-results')!;
const retry = dialog.querySelector<HTMLButtonElement>('.search-retry')!;
let posts: SearchPost[] | undefined;
let loading = false;
let previousFocus: HTMLElement | null = null;

function renderResults() {
  if (!posts) return;
  const matches = searchPosts(posts, input.value);
  results.replaceChildren();
  status.textContent = matches.length
    ? (input.value.trim() ? '找到 ' : '全部 ') + matches.length + ' 篇文章'
    : '没有找到相关内容，试试另一个关键词。';
  for (const post of matches) {
    const item = document.createElement('li');
    const link = document.createElement('a');
    const meta = document.createElement('span');
    const heading = document.createElement('h3');
    const description = document.createElement('p');
    link.href = post.url;
    meta.className = 'search-result-meta';
    meta.textContent = post.category + ' · ' + post.date;
    heading.textContent = post.title;
    description.textContent = post.description;
    link.append(meta, heading, description);
    item.append(link);
    results.append(item);
  }
}

async function loadPosts() {
  if (posts || loading) return;
  loading = true;
  retry.hidden = true;
  status.textContent = '正在读取文章…';
  try {
    const response = await fetch(dialog.dataset.index!, { signal: AbortSignal.timeout(10000) });
    if (!response.ok) throw new Error('搜索索引 HTTP ' + response.status);
    const data: unknown = await response.json();
    posts = parseSearchIndex(data, href('posts/'));
    renderResults();
  } catch (error) {
    posts = undefined;
    results.replaceChildren();
    console.error('文章搜索加载失败', error);
    status.textContent = '文章索引暂时无法读取，请检查网络后重试。';
    retry.hidden = false;
  } finally {
    loading = false;
  }
}

function openSearch() {
  if (dialog.open) return;
  previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  dialog.showModal();
  input.focus();
  if (posts) renderResults();
  else void loadPosts();
}

document.querySelectorAll<HTMLButtonElement>('[data-search-open]').forEach((button) => button.addEventListener('click', openSearch));
dialog.querySelector('[data-search-close]')!.addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (event) => {
  if (event.target !== dialog) return;
  const rect = dialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
});
dialog.addEventListener('close', () => previousFocus?.focus());
input.addEventListener('input', renderResults);
retry.addEventListener('click', () => { void loadPosts(); });
document.addEventListener('keydown', (event) => {
  if (event.isComposing) return;
  if (dialog.open && event.key === 'Escape') {
    event.preventDefault();
    dialog.close();
    return;
  }
  const target = event.target;
  const typing = target instanceof HTMLElement && (target.matches('input, textarea, select') || target.isContentEditable);
  const shortcut = event.key === '/' && !event.metaKey && !event.ctrlKey && !event.altKey;
  const commandK = event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey);
  if ((!typing && shortcut) || commandK) {
    event.preventDefault();
    openSearch();
  }
});
