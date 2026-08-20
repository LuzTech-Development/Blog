import type { CollectionEntry } from 'astro:content';
import { postFilter } from './postFilter';
import { slugifyStr } from './slugify';

export type Author = {
  /** Slug used in URLs (lowercased, kebab-case). */
  slug: string;
  /** Display name exactly as written in the post frontmatter. */
  name: string;
  /** Optional email resolved elsewhere (kept for backwards compatibility). */
  email: string | null;
  /** Number of published posts by this author. */
  count: number;
};

/**
 * Resolves the canonical author slug used in URLs.
 */
export function resolveAuthorSlug(
  name: string | null | undefined
): string | null {
  const fallback = slugifyStr(name ?? '');
  return fallback || null;
}

/**
 * Builds a de-duplicated, sorted author list from posts.
 *
 * - Drafts and scheduled posts are excluded via `postFilter()`
 * - Uniqueness is based on the slugified author name (so casing differences
 *   collapse). Kept intentionally simple: two authors with the same slug are
 *   assumed to be the same person.
 */
export function getUniqueAuthors(posts: CollectionEntry<'posts'>[]): Author[] {
  const seen = new Map<string, Author>();
  for (const post of posts.filter(postFilter)) {
    const name = post.data.author;
    if (!name) continue;
    const slug = resolveAuthorSlug(name);
    if (!slug) continue;
    const existing = seen.get(slug);
    if (existing) {
      existing.count += 1;
    } else {
      seen.set(slug, {
        slug,
        name,
        email: null,
        count: 1
      });
    }
  }
  return [...seen.values()].sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Returns the {slug, name, email} for a single post's author, without touching
 * the collection at large. Used by the post byline.
 */
export function getPostAuthor(
  post: CollectionEntry<'posts'>
): Pick<Author, 'slug' | 'name' | 'email'> | null {
  const name = post.data.author;
  if (!name) return null;
  const slug = resolveAuthorSlug(name);
  if (!slug) return null;
  return { slug, name, email: null };
}
