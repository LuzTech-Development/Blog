import type { CollectionEntry } from 'astro:content';
import config from '@/config';

/**
 * Whether a post is considered "published" (i.e. not a draft).
 *
 * In dev, drafts are treated as published so authors can preview a post
 * before its translation pair is ready — no need to flip `draft: false`
 * just to start writing. In production, drafts are always excluded.
 */
export function isPublished({ data }: CollectionEntry<'posts'>): boolean {
  return import.meta.env.DEV || !data.draft;
}

/**
 * Determines whether a post is eligible to be listed/rendered.
 *
 * - In dev, shows drafts too so authors can preview a post before its
 *   translation pair is ready (no need to flip `draft: false` just to write).
 * - In production, excludes drafts always.
 * - In production, excludes scheduled posts until `pubDatetime` minus the configured margin.
 */
export function postFilter(post: CollectionEntry<'posts'>) {
  const isPublishTimePassed =
    Date.now() >
    new Date(post.data.pubDatetime).getTime() -
      config.posts.scheduledPostMargin;
  return isPublished(post) && isPublishTimePassed;
}
