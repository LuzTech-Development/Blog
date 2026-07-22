import type { UIStrings } from "./types";
import { DEFAULT_LOCALE } from "@/utils/i18n";

export { tplStr } from "./format";

const modules = import.meta.glob<{ default: UIStrings }>("./lang/*.ts", {
  eager: true,
});

const translations: Record<string, UIStrings> = {};
for (const [path, mod] of Object.entries(modules)) {
  const locale = path.slice("./lang/".length, -".ts".length);
  translations[locale] = mod.default;
}

/** Returns UI strings for the given locale, falling back to the default. */
export function useTranslations(
  locale: string | undefined = DEFAULT_LOCALE
): UIStrings {
  return translations[locale] ?? translations[DEFAULT_LOCALE];
}
