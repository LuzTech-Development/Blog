import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";
import config from "@/config";
import { LOCALES, type Locale } from "@/utils/i18n";

export const BLOG_PATH = "src/content/blog";

/**
 * Derive `{ locale, slugId }` from the content collection `id`, which for a file
 * at `blog/{locale}/{...slug}.md` is `"{locale}/{...slug}"` (Astro lowercases
 * the id, so `en-US` on disk arrives as `en-us`).
 *
 * `slugId` is the translation-pairing key: two posts with the same `slugId` in
 * different locales are considered translations of each other.
 */
function splitLocaleFromId(id: string): { locale: Locale; slugId: string } {
  const [maybeLocale, ...rest] = id.split("/");
  const canonical = LOCALES.find(
    l => l.toLowerCase() === maybeLocale.toLowerCase()
  );
  if (canonical) {
    return {
      locale: canonical,
      slugId: rest.join("/") || canonical,
    };
  }
  throw new Error(
    `Content entry "${id}" is missing a locale folder prefix. Place it under ` +
      `one of: ${LOCALES.map(l => `${BLOG_PATH}/${l}/`).join(", ")}.`
  );
}

const posts = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: `./${BLOG_PATH}` }),
  schema: ({ image }) =>
    z.object({
      author: z.string().default(config.site.author),
      pubDatetime: z.date(),
      modDatetime: z.date().optional().nullable(),
      title: z.string(),
      featured: z.boolean().optional(),
      draft: z.boolean().optional(),
      tags: z.array(z.string()).default(["others"]),
      ogImage: image().or(z.string()).optional(),
      description: z.string(),
      canonicalURL: z.string().optional(),
      hideEditPost: z.boolean().optional(),
      timezone: z.string().optional(),
    }),
});

const pages = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/pages" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    ogImage: z.string().optional(),
    canonicalURL: z.string().optional(),
  }),
});

export const collections = { posts, pages };
export { splitLocaleFromId };
