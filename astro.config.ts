import {
  defineConfig,
  envField,
  svgoOptimizer,
} from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { unified } from "@astrojs/markdown-remark";
import remarkToc from "remark-toc";
import remarkCollapse from "remark-collapse";
import rehypeCallouts from "rehype-callouts";
import {
  transformerNotationDiff,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
} from "@shikijs/transformers";
import { transformerFileName } from "./src/utils/transformers/fileName";
import config from "./astro-paper.config";

export default defineConfig({
  site: config.site.url,
  integrations: [
    mdx(),
    sitemap({
      i18n: {
        defaultLocale: "en-us",
        locales: {
          "en-us": "en-US",
          "pt-br": "pt-BR",
        },
      },
      filter: page =>
        config.features?.showArchives !== false ||
        !/\/(en-us|pt-br)\/archives\/?$/.test(page),
    }),
  ],
  i18n: {
    locales: [
      { path: "en-us", codes: ["en-US", "en"] },
      { path: "pt-br", codes: ["pt-BR", "pt"] },
    ],
    // Runtime expects a value matching one of the `path` entries above, while
    // Astro's TypeScript types constrain this field to values from `codes`.
    // The runtime check is authoritative for URL generation — see astro build
    // error "default locale ... is not present in the i18n.locales array".
    // @ts-expect-error — astro/config typing mismatch when using object-form locales.
    defaultLocale: "en-us",
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: false,
    },
  },
  markdown: {
    processor: unified({
      remarkPlugins: [
        remarkToc,
        [remarkCollapse, { test: "Table of contents" }],
      ],
      rehypePlugins: [rehypeCallouts],
    }),
    shikiConfig: {
      themes: { light: "min-light", dark: "night-owl" },
      defaultColor: false,
      wrap: false,
      transformers: [
        transformerFileName({ style: "v2", hideDot: false }),
        transformerNotationHighlight(),
        transformerNotationWordHighlight(),
        transformerNotationDiff({ matchAlgorithm: "v3" }),
      ],
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
  env: {
    schema: {
      PUBLIC_GOOGLE_SITE_VERIFICATION: envField.string({
        access: "public",
        context: "client",
        optional: true,
      }),
    },
  },
  experimental: {
    svgOptimizer: svgoOptimizer(),
  },
});
