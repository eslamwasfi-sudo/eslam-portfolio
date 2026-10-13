// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// ─── Where the site lives ───────────────────────────────────────────
// GitHub Pages project site:  https://eslamwasfi-sudo.github.io/eslam-portfolio/
// Using a custom domain later (e.g. https://eslamwasfi.com)? Set SITE to it and BASE to '/'.
const SITE = 'https://eslamwasfi-sudo.github.io';
const BASE = '/eslam-portfolio';

export default defineConfig({
  site: SITE,
  base: BASE,
  trailingSlash: 'always',
  output: 'static',
  build: { inlineStylesheets: 'always' },
  integrations: [
    sitemap({
      i18n: { defaultLocale: 'ar', locales: { ar: 'ar', en: 'en' } },
      filter: (page) => !page.endsWith(`${BASE}/`) && !page.includes('/404'),
    }),
  ],
});
