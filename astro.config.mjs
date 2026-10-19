import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { unified } from '@astrojs/markdown-remark';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { SITE } from './src/lib/site.mjs';

export default defineConfig({
  site: SITE.url,
  base: SITE.base,
  trailingSlash: 'always',
  output: 'static',
  integrations: [sitemap()],
  markdown: {
    processor: unified({
      remarkPlugins: [remarkMath],
      rehypePlugins: [[rehypeKatex, { strict: false }]],
    }),
    shikiConfig: { theme: 'github-light', wrap: true },
  },
});
