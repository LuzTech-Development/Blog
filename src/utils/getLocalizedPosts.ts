import { getCollection, type CollectionEntry } from "astro:content";
import { getPostLocale, getPostSlugId } from "./getPostPaths";
import { LOCALES, type Locale } from "./i18n";

type Post = CollectionEntry<"posts">;

/**
 * Ensures every published post has a translation in every configured locale.
 *
 * A post is considered published when `draft` is not `true`.
 * If a published post exists in some (but not all) locales, this throws a
 * descriptive error listing the missing translations. That surfaces as a
 * hard failure during `astro build` / `astro check`, which is the intended
 * behaviour: articles must be manually translated to both languages, or
 * marked `draft: true` in every locale where they exist.
 */
export function assertTranslationCoverage(posts: Post[]): void {
  const bySlugId = new Map<string, Map<Locale, Post>>();
  for (const post of posts) {
    const slugId = getPostSlugId(post.id);
    const locale = getPostLocale(post.id);
    let byLocale = bySlugId.get(slugId);
    if (!byLocale) {
      byLocale = new Map();
      bySlugId.set(slugId, byLocale);
    }
    byLocale.set(locale, post);
  }

  const errors: string[] = [];
  for (const [slugId, byLocale] of bySlugId) {
    const publishedLocales = new Set<Locale>();
    for (const [locale, post] of byLocale) {
      if (!post.data.draft) publishedLocales.add(locale);
    }
    if (publishedLocales.size === 0) continue;
    const missing = LOCALES.filter(l => !publishedLocales.has(l));
    if (missing.length > 0) {
      errors.push(
        `  • "${slugId}" is published in [${[...publishedLocales].join(", ")}] but missing translations in [${missing.join(", ")}].`
      );
    }
  }

  if (errors.length > 0) {
    throw new Error(
      `\nMissing localized translations detected:\n${errors.join("\n")}\n\n` +
        `Every published post must exist in all configured locales ` +
        `(${LOCALES.join(", ")}), or be marked \`draft: true\` in the ` +
        `locale(s) where it is not ready yet.\n`
    );
  }
}

/**
 * Fetches posts for a specific locale and, as a side effect, validates that
 * translation coverage is complete across the whole collection.
 */
export async function getLocalizedPosts(locale: Locale): Promise<Post[]> {
  const allPosts = await getCollection("posts");
  assertTranslationCoverage(allPosts);
  return allPosts.filter(post => getPostLocale(post.id) === locale);
}
