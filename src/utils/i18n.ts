/**
 * Central i18n helpers used across pages, components, and content utilities.
 *
 * Keep this in sync with the `i18n.locales` entry in `astro.config.ts`.
 * There is no server-side runtime in this project — locale detection happens
 * client-side in the root landing page (see `src/pages/index.astro`).
 *
 * URL path vs. canonical (BCP-47) code:
 *   • Canonical:   "en-US", "pt-BR" (used for <html lang>, hreflang, storage, content folders)
 *   • URL path:    "en-us", "pt-br" (Astro lowercases URL segments — see astro.config.ts)
 */

export const LOCALES = ["en-US", "pt-BR"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en-US";

/** Lowercased URL segment used in generated links. */
export const LOCALE_URL_PATH: Record<Locale, string> = {
  "en-US": "en-us",
  "pt-BR": "pt-br",
};

/** Reverse lookup from URL segment back to canonical code. */
const URL_PATH_TO_LOCALE = Object.fromEntries(
  Object.entries(LOCALE_URL_PATH).map(([code, path]) => [path, code as Locale])
) as Record<string, Locale>;

/** Human-readable label shown in the language switcher. */
export const LOCALE_LABELS: Record<Locale, string> = {
  "en-US": "English",
  "pt-BR": "Português",
};

/** Short label (used on compact UI). */
export const LOCALE_SHORT_LABELS: Record<Locale, string> = {
  "en-US": "EN",
  "pt-BR": "PT",
};

/** localStorage key used to persist an explicit user choice. */
export const LOCALE_STORAGE_KEY = "preferred-locale";

export function isLocale(value: string | undefined | null): value is Locale {
  return !!value && (LOCALES as readonly string[]).includes(value);
}

/**
 * Coerce a value into a supported locale, falling back to the default.
 * Any `pt-*` variant collapses to `pt-BR`. Everything else falls back
 * to `en-US`.
 */
export function resolveLocale(value: string | undefined | null): Locale {
  if (isLocale(value)) return value;
  if (value && URL_PATH_TO_LOCALE[value.toLowerCase()]) {
    return URL_PATH_TO_LOCALE[value.toLowerCase()];
  }
  if (value && value.toLowerCase().startsWith("pt")) return "pt-BR";
  if (value && value.toLowerCase().startsWith("en")) return "en-US";
  return DEFAULT_LOCALE;
}

/** Convert canonical locale code to the lowercase URL path segment. */
export function localeToPath(locale: Locale): string {
  return LOCALE_URL_PATH[locale];
}

/**
 * Swap the locale prefix on a root-relative pathname.
 * If the path has no locale prefix, prepends the target locale.
 * Always writes the lowercase URL path form.
 */
export function swapLocaleInPath(pathname: string, target: Locale): string {
  const targetPath = localeToPath(target);
  const match = pathname.match(/^\/([^/]+)(\/.*)?$/);
  if (!match) return `/${targetPath}/`;
  const [, first, rest = "/"] = match;
  const knownFirst = URL_PATH_TO_LOCALE[first?.toLowerCase() ?? ""];
  if (knownFirst) return `/${targetPath}${rest || "/"}`;
  return `/${targetPath}${pathname.startsWith("/") ? pathname : `/${pathname}`}`;
}

/**
 * Convenience helper for pages that don't have other dynamic params:
 * emits `[{ params: { locale: "en-us" } }, { params: { locale: "pt-br" } }]`.
 */
export function getStaticLocalePaths() {
  return LOCALES.map(locale => ({ params: { locale: localeToPath(locale) } }));
}

/**
 * Validate & coerce the `locale` route param.
 * Accepts either the URL-path form (`en-us`) or the canonical code (`en-US`)
 * and always returns the canonical `Locale`.
 */
export function assertLocaleParam(value: string | undefined): Locale {
  const canonical =
    (value && URL_PATH_TO_LOCALE[value.toLowerCase()]) ||
    (isLocale(value) ? value : undefined);
  if (canonical) return canonical;
  throw new Error(
    `Unsupported locale route param: "${value}". Expected one of: ${LOCALES.map(
      l => `${l} / ${localeToPath(l)}`
    ).join(", ")}.`
  );
}
