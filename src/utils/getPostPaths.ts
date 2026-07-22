import { getRelativeLocaleUrl } from "astro:i18n";
import { BLOG_PATH, splitLocaleFromId } from "@/content.config";
import { slugifyStr } from "./slugify";
import { LOCALES, type Locale, resolveLocale } from "./i18n";
import config from "@/config";

function getPostPathSegments(
  filePath: string | undefined,
  locale: Locale
): string[] {
  return (
    filePath
      ?.replace(BLOG_PATH, "")
      // Drop the leading locale folder (e.g. /en-US) so it doesn't leak
      // into the public URL — Astro adds it via i18n routing.
      .replace(new RegExp(`^/?${locale}/`, "i"), "/")
      .split("/")
      .filter(path => path !== "")
      .filter(path => !path.startsWith("_"))
      .slice(0, -1)
      .map(segment => slugifyStr(segment)) ?? []
  );
}

function getIdSlug(id: string): string {
  // Strip the leading locale segment, then take the last path segment
  // as the slug (mirrors AstroPaper's original behaviour).
  const parts = id.split("/");
  const [maybeLocale, ...rest] = parts;
  const isLocalePrefix = LOCALES.some(
    l => l.toLowerCase() === maybeLocale?.toLowerCase()
  );
  const withoutLocale = isLocalePrefix ? rest : parts;
  const last = withoutLocale[withoutLocale.length - 1];
  return last ?? id;
}

function getPostSlugPath(
  id: string,
  filePath: string | undefined,
  locale: Locale
): string {
  const pathSegments = getPostPathSegments(filePath, locale);
  const slug = getIdSlug(id);
  return pathSegments.length > 0
    ? [...pathSegments, slug].join("/")
    : String(slug);
}

/**
 * Extracts the locale of a post from its collection `id`.
 * Throws if the post is missing a locale prefix.
 */
export function getPostLocale(id: string): Locale {
  return splitLocaleFromId(id).locale;
}

/**
 * The translation-pairing key: two posts with the same value in different
 * locales are considered translations of each other.
 */
export function getPostSlugId(id: string): string {
  return splitLocaleFromId(id).slugId;
}

/**
 * Returns the slug-only path for use as a route param in `getStaticPaths`.
 * No base prefix, no locale — Astro handles those at a higher level.
 * e.g. `/examples/my-post`
 */
export function getPostSlug(id: string, filePath: string | undefined): string {
  return `/${getPostSlugPath(id, filePath, getPostLocale(id))}`;
}

/**
 * Returns a fully navigable URL for use in `<a href>` and RSS links.
 * Applies both locale routing and the configured Astro base via
 * `getRelativeLocaleUrl`.
 * e.g. `/en-us/posts/my-post` or `/pt-br/posts/my-post`
 */
export function getPostUrl(
  id: string,
  filePath: string | undefined,
  locale: string | undefined = config.site.lang
): string {
  const postLocale: Locale = resolveLocale(locale);
  return getRelativeLocaleUrl(
    postLocale,
    `posts/${getPostSlugPath(id, filePath, postLocale)}`
  );
}
