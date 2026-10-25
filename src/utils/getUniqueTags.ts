import type { CollectionEntry } from 'astro:content';
import { postFilter } from './postFilter';
import { slugifyStr } from './slugify';

type Tag = {
  tag: string;
  tagName: string;
};

/**
 * Builds a de-duplicated, sorted tag list from posts.
 *
 * - Drafts and scheduled posts are excluded via `postFilter()`
 * - `tag` is the slug used in URLs; `tagName` is the original label for display
 * - Uniqueness is based on the slug (so differently-cased labels collapse)
 */
export function getUniqueTags(posts: CollectionEntry<'posts'>[]) {
  const seen = new Map<string, Tag>();
  for (const post of posts.filter(postFilter)) {
    for (const tag of post.data.tags) {
      const slug = slugifyStr(tag);
      if (!seen.has(slug)) {
        seen.set(slug, { tag: slug, tagName: tag });
      }
    }
  }
  return [...seen.values()].sort((tagA, tagB) =>
    tagA.tag.localeCompare(tagB.tag)
  );
}
