import getReadingTime from 'reading-time';
import { toString } from 'mdast-util-to-string';

/**
 * Minimal structural shape of an Astro-flavored VFile: `data.astro.frontmatter`
 * is where content collections expose extra fields that can be read back via
 * `remarkPluginFrontmatter` on the caller side. Declared inline to avoid
 * pulling `mdast`/`vfile` as explicit deps just for their type declarations.
 */
type AstroVFile = {
  data: {
    astro?: {
      frontmatter?: Record<string, unknown>;
    };
  };
};

/**
 * Computes the estimated reading time (in whole minutes, minimum 1) and
 * publishes it as `minutesRead` in Astro's per-file remark frontmatter.
 *
 * Access from a page via:
 *
 *   const { Content, remarkPluginFrontmatter } = await render(post);
 *   const minutes = remarkPluginFrontmatter.minutesRead as number;
 *
 * The label ("min", "min de leitura", etc.) is deliberately kept in the
 * i18n dictionary so the presentation can be localized without touching
 * this plugin.
 */
export function remarkReadingTime() {
  return function transformer(tree: any, file: AstroVFile) {
    const text = toString(tree);
    const { minutes } = getReadingTime(text);
    const rounded = Math.max(1, Math.round(minutes));

    file.data.astro ??= {};
    file.data.astro.frontmatter ??= {};
    file.data.astro.frontmatter.minutesRead = rounded;
  };
}
