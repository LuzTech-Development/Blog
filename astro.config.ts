import { defineConfig, envField, svgoOptimizer } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { unified } from '@astrojs/markdown-remark';
import remarkToc from 'remark-toc';
import remarkCollapse from 'remark-collapse';
import {
  transformerNotationDiff,
  transformerNotationHighlight,
  transformerNotationWordHighlight
} from '@shikijs/transformers';
import { transformerFileName } from './src/utils/transformers/fileName';
import { localizedCallouts } from './src/utils/rehype/localizedCallouts';
import { remarkReadingTime } from './src/utils/remark/readingTime';
import config from './astro-paper.config';

/**
 * Heading names that trigger automatic table-of-contents generation and
 * `<details>` collapsing. Shared between `remark-toc` and `remark-collapse`
 * so both plugins recognize the exact same set of aliases (English +
 * pt-BR).
 *
 * Note: `remark-toc` expects a string it wraps in `^(...)$` internally, so
 * we keep the body as a plain string and derive the regex for
 * `remark-collapse` from it.
 */
const tocHeadingSource =
  'toc|table[ -]of[ -]contents?|contents?|index|índice|sumário|summary';
const tocHeadingRegex = new RegExp(`^(${tocHeadingSource})$`, 'i');

export default defineConfig({
  site: config.site.url,
  integrations: [
    mdx(),
    sitemap({
      i18n: {
        defaultLocale: 'en-us',
        locales: {
          'en-us': 'en-US',
          'pt-br': 'pt-BR'
        }
      },
      filter: page =>
        config.features?.showArchives !== false ||
        !/\/(en-us|pt-br)\/archives\/?$/.test(page)
    })
  ],
  i18n: {
    locales: [
      { path: 'en-us', codes: ['en-US', 'en'] },
      { path: 'pt-br', codes: ['pt-BR', 'pt'] }
    ],
    // Runtime expects a value matching one of the `path` entries above, while
    // Astro's TypeScript types constrain this field to values from `codes`.
    // The runtime check is authoritative for URL generation — see astro build
    // error "default locale ... is not present in the i18n.locales array".
    // @ts-expect-error — astro/config typing mismatch when using object-form locales.
    defaultLocale: 'en-us',
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: false
    }
  },
  markdown: {
    processor: unified({
      remarkPlugins: [
        remarkReadingTime,
        [remarkToc, { heading: tocHeadingSource }],
        [
          remarkCollapse,
          {
            test: tocHeadingRegex,
            // Default prepends "open " to the heading text; use the
            // heading text as-is so it stays localized.
            summary: (heading: string) => heading
          }
        ]
      ],
      rehypePlugins: [localizedCallouts]
    }),
    shikiConfig: {
      themes: { light: 'min-light', dark: 'night-owl' },
      defaultColor: false,
      wrap: false,
      transformers: [
        transformerFileName({ style: 'v2', hideDot: false }),
        transformerNotationHighlight(),
        transformerNotationWordHighlight(),
        transformerNotationDiff({ matchAlgorithm: 'v3' })
      ]
    }
  },
  vite: {
    plugins: [tailwindcss()]
  },
  env: {
    schema: {
      PUBLIC_GOOGLE_SITE_VERIFICATION: envField.string({
        access: 'public',
        context: 'client',
        optional: true
      })
    }
  },
  experimental: {
    svgOptimizer: svgoOptimizer()
  },
  server: {
    port: 3000
  }
});
