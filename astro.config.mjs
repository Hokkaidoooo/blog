import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { SITE } from './src/lib/site.mjs';

export default defineConfig({
  site: SITE.url,
  base: SITE.base,
  trailingSlash: 'always',
  output: 'static',
  integrations: [sitemap()],
  markdown: {
    shikiConfig: { theme: 'github-light', wrap: true },
  },
});
