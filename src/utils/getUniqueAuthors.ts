import type { CollectionEntry } from "astro:content";
import { postFilter } from "./postFilter";
import { slugifyStr } from "./slugify";

export type Author = {
  /** Slug used in URLs (lowercased, kebab-case). */
  slug: string;
  /** Display name exactly as written in the post frontmatter. */
  name: string;
  /** Email captured at post creation time, or `null` if not set. */
  email: string | null;
  /** Number of published posts by this author. */
  count: number;
};

/**
 * Builds a de-duplicated, sorted author list from posts.
 *
 * - Drafts and scheduled posts are excluded via `postFilter()`
 * - Uniqueness is based on the slugified author name (so casing differences
 *   collapse). Kept intentionally simple: two authors with the same slug are
 *   assumed to be the same person, and their first-seen `name` + `email` wins.
 */
export function getUniqueAuthors(posts: CollectionEntry<"posts">[]): Author[] {
  const seen = new Map<string, Author>();
  for (const post of posts.filter(postFilter)) {
    const name = post.data.author;
    if (!name) continue;
    const slug = slugifyStr(name);
    if (!slug) continue;
    const existing = seen.get(slug);
    if (existing) {
      existing.count += 1;
      if (!existing.email && post.data.authorEmail) {
        existing.email = post.data.authorEmail;
      }
    } else {
      seen.set(slug, {
        slug,
        name,
        email: post.data.authorEmail ?? null,
        count: 1,
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
  post: CollectionEntry<"posts">
): Pick<Author, "slug" | "name" | "email"> | null {
  const name = post.data.author;
  if (!name) return null;
  const slug = slugifyStr(name);
  if (!slug) return null;
  return { slug, name, email: post.data.authorEmail ?? null };
}
