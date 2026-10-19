# Hokkaido · 手记

用于学习笔记、生活随笔和内容创作的静态博客。博客地址：<https://hokkaidoooo.github.io/blog/>，由 GitHub Pages 免费托管。

## 本地使用

在博客目录打开终端，安装锁定的依赖并启动开发预览：

```powershell
npm ci
npm run dev
```

打开 <http://127.0.0.1:4321/blog/>。检查实际发布产物时，先按 `Ctrl+C` 停止开发服务，再执行：

```powershell
npm run build
npm run preview
```

静态文件输出到 `dist`，预览地址相同。开发和产物预览共用 4321 端口，不要同时启动。

## 写一篇文章

1. 复制 [新文章模板](templates/new-post.md) 到 `src\content\posts`，改成简短、稳定的英文文件名，例如 `reading-notes.md`；文件名决定文章地址。
2. 填写文件开头的 frontmatter 和正文，把模板日期改成实际发文日期。写作期间保留 `draft: true`。
3. 内容准备好后改成 `draft: false`，本地查看，再构建发布。

| 字段 | 用法 |
| --- | --- |
| `title` | 文章标题，1—100 个字符 |
| `description` | 文章摘要，1—180 个字符 |
| `date` | 发文日期，例如 `2026-10-16` |
| `category` | `learning` 学习笔记、`life` 生活随笔、`creating` 内容创作 |
| `tags` | 1—5 个非空主题标签 |
| `cover` | 文章列表配图：`http`、`cache`、`io`、`mle` 或 `writing` |
| `featured` | 是否作为精选文章，默认 `false` |
| `draft` | 是否为草稿；模板默认 `true`，省略字段时程序默认 `false` |

`draft: true` 的文章不会进入网站。未来日期的文章要等到日期到达后**再次构建并发布**才会出现，现有工作流没有定时发文功能。草稿标记只影响网站：若把源文件提交到公开仓库，Markdown 本身仍能被查看，私密草稿应留在本地。

文章只维护 `src\content\posts` 中的 Markdown 一份真源，不手工修改生成的文章页面或搜索数据。`templates` 不在文章加载目录内，模板不会被当成文章发布。

站点名称、地址、分类和配图登记统一在 [`src\lib\site.mjs`](src/lib/site.mjs)；增加分类或配图时修改这里。图片文件放在 `public\images`。

## 阅读排版

排版参考 [《排版的艺术：一条很长很长的路》](https://re.karlbaey.top/articles/typography/)，保留米白、墨绿与衬线标题。首页先展示最近文章；阅读页的标题后直接进入正文，列表封面不重复插入文章。

正文使用系统无衬线字体、左对齐与受控行长，代码和表格可在各自区域横向滚动。手机目录默认收起，原生展开与跳转不依赖 JavaScript；宽屏默认展开。字号和阅读宽度在 `src\styles\global.css` 维护。

全站支持 KaTeX 数学公式。通过 Markdown 渲染的内容（文章和未来的 Markdown 页面）行内写 `$...$`，独立公式写 `$$...$$`；公式在构建时由 KaTeX 转成 HTML 与 MathML，不依赖客户端 JavaScript，公式过长时可在公式区域内横向滚动。

`.astro` 页面可以复用 [`Math.astro`](src/components/Math.astro)：

```astro
---
import Math from '../components/Math.astro';
---
<p>质能方程：<Math tex={String.raw`E = mc^2`} />。</p>
<Math tex={String.raw`\int_0^1 x^2\,\mathrm{d}x = \frac{1}{3}`} display />
```

`.astro` 属性里的反斜杠会按字符串转义处理，所以公式要用 `String.raw` 包一层；Markdown 里的 `$...$` 不受这个限制。

KaTeX 样式统一在 `src\layouts\Base.astro` 引入，不需要逐页导入。标题里不要写公式标记，目录取的是标题纯文本，直接写 `p`、`θ` 这类字符即可。

## 免费部署

不需要购买服务器或域名。GitHub Pages 可为公开的 `blog` 仓库免费托管此站，使用 `github.io` 地址；Cloudflare Pages 和 Netlify 也提供免费方案，分别分配 `pages.dev`、`netlify.app` 地址。自定义域名是可选的付费项，免费方案的具体额度以各平台说明为准。

GitHub Actions 工作流已写在 [`.github\workflows\deploy.yml`](.github/workflows/deploy.yml)。部署到 GitHub 时，使用名为 `blog` 的公开仓库，在 **Settings → Pages → Source** 选择 **GitHub Actions**；推送 `main` 或手动运行工作流会执行检查、构建和发布。仓库地址与当前配置对应：

```js
url: 'https://hokkaidoooo.github.io',
base: '/blog/',
```

切换到 Cloudflare Pages 或 Netlify 时，在同一份 `SITE` 配置中将 `url` 改为平台实际分配的站点地址；若部署在该域名根目录，将 `base` 改为 `/`。构建命令用 `npm run build`，发布目录用 `dist`，无需运行后端服务器。

## 工程环境

站点使用 Astro `7.4.0`。项目依赖自带 Node `22.23.3`，放在 `node_modules\node`；通过 `npm run` 执行的命令会优先使用它，不修改系统 PATH 或其他项目的 Node。可以用 `npm run runtime` 核对实际运行版本。本机 Node `22.14` 仅用于启动 npm 安装。

请保留 `package-lock.json`，使用 `npm ci` 安装。浏览器检查使用同版本的 Playwright 测试工具与核心（`1.56.1`），Windows 下调用已安装的 Edge。日常检查为 `npm test`、`npm run check`、`npm run build`；在预览服务已经启动后，可运行 `npm run test:browser`。

## 配图来源

`landscape.jpg` 和 `writing.jpg` 为 Unsplash 图库氛围配图，不是作者本人拍摄：

- `public\images\landscape.jpg`：[原始图片来源](https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1400&q=85)。
- `public\images\writing.jpg`：[原始图片来源](https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1000&q=85)。
- `public\images\mle-problem.png` 和 `public\images\mle-overview.png` 为《一道题真正理解极大似然估计的本质》的题目与知识地图配图，由作者提供。

照片使用条款见 [Unsplash License](https://unsplash.com/license)。`http.svg`、`cache.svg`、`io.svg` 和 `mle.svg` 为本站绘制的技术示意图。
