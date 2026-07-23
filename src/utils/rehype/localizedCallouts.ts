import { unified, type Processor } from 'unified';
import rehypeCallouts, { type UserOptions } from 'rehype-callouts';
import { LOCALES, DEFAULT_LOCALE, type Locale } from '../i18n';
import { CALLOUT_TITLES } from './calloutTitles';

/**
 * Structural subset of the Unified `Transformer` signature we rely on. Kept
 * intentionally permissive (`any`) so it satisfies both the strict
 * `Transformer<Root, Root>` that Astro consumes and the callback shape
 * `rehype-callouts` itself uses internally — without pulling `unified`,
 * `hast`, or `vfile` as explicit deps just for their types.
 */
type CalloutsTransformer = (tree: any, file: any, next?: any) => any;

/** Minimal shape of a Unified `VFile` — the fields we actually read. */
type MdxVFile = { path?: string; history?: readonly string[] };

/**
 * Detect the locale of an MDX/Markdown file from its source path. Content
 * lives under `src/content/blog/<locale>/<slug>.mdx`, so the locale segment
 * is a reliable marker. Falls back to `DEFAULT_LOCALE` when the file lives
 * outside that tree (e.g. `src/content/pages/*`).
 */
function detectLocale(file: MdxVFile): Locale {
  const raw = file.path ?? file.history?.[0] ?? '';
  const path = raw.replaceAll('\\', '/');
  for (const locale of LOCALES) {
    if (path.includes(`/content/blog/${locale}/`)) return locale;
  }
  return DEFAULT_LOCALE;
}

function buildOptions(locale: Locale): UserOptions {
  const titles = CALLOUT_TITLES[locale];
  const callouts: NonNullable<UserOptions['callouts']> = {};
  for (const type of Object.keys(titles) as (keyof typeof titles)[]) {
    callouts[type] = { title: titles[type] };
  }
  return { callouts };
}

/**
 * Wrapper around `rehype-callouts` that applies locale-aware titles based on
 * the source file path.
 *
 * Uses one frozen `unified` processor per locale to run `rehype-callouts` in
 * its native pipeline — the plugin isn't safe to instantiate as a bare
 * factory outside of unified because of its internal async setup.
 *
 * Translations live in `./calloutTitles` and are typed as
 * `Record<Locale, ...>`, so adding a new `Locale` without extending the
 * dictionary is a TypeScript build error caught by `astro check`.
 */
export function localizedCallouts(): CalloutsTransformer {
  const cache = new Map<Locale, Processor<any, any, any, any, any>>();

  return async function transformer(tree, file) {
    const locale = detectLocale(file as MdxVFile);
    let processor = cache.get(locale);
    if (!processor) {
      processor = unified().use(rehypeCallouts, buildOptions(locale)).freeze();
      cache.set(locale, processor);
    }
    return await processor.run(tree, file);
  };
}
