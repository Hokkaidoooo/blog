const article = document.querySelector<HTMLElement>('#article-body')!;
const progress = document.querySelector<HTMLProgressElement>('.reading-progress')!;
const headings = Array.from(article.querySelectorAll<HTMLElement>('h2'));
const tocLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>('.toc-sticky ol a'));
let pendingFrame = false;

function updateReading() {
  const top = article.getBoundingClientRect().top + window.scrollY;
  const range = Math.max(article.offsetHeight - window.innerHeight * .55, 1);
  progress.value = Math.min(100, Math.max(0, (window.scrollY - top + 120) / range * 100));
  const current = headings.findLast((heading) => heading.getBoundingClientRect().top <= 160);
  for (const link of tocLinks) {
    const active = current && decodeURIComponent(link.hash.slice(1)) === current.id;
    if (active) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  }
  pendingFrame = false;
}

function scheduleReading() {
  if (pendingFrame) return;
  pendingFrame = true;
  requestAnimationFrame(updateReading);
}

window.addEventListener('scroll', scheduleReading, { passive: true });
window.addEventListener('resize', scheduleReading);
updateReading();

const copyButton = document.querySelector<HTMLButtonElement>('#copy-link')!;
const copyStatus = document.querySelector<HTMLElement>('#copy-status')!;
copyButton.addEventListener('click', async () => {
  try {
    if (!navigator.clipboard) throw new Error('当前浏览器未开放剪贴板');
    const url = new URL(window.location.href);
    url.hash = '';
    await navigator.clipboard.writeText(url.href);
    copyStatus.textContent = '链接已复制。';
  } catch (error) {
    console.error('复制文章链接失败', error);
    copyStatus.textContent = '复制未成功，可以从浏览器地址栏复制链接。';
  }
});
