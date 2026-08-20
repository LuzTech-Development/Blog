import { getCollection, type CollectionEntry } from 'astro:content';
import { splitLocaleFromAuthorsId } from '@/content.config';
import type { Locale } from './i18n';
import { slugifyStr } from './slugify';

export type AuthorProfileEntry = CollectionEntry<'authors'>;

function getProfileSlug(id: string): string | null {
  const { slugId } = splitLocaleFromAuthorsId(id);
  const parts = slugId.split('/').filter(Boolean);
  const last = parts[parts.length - 1] ?? slugId;
  const slug = slugifyStr(last);
  return slug || null;
}

/**
 * Returns all author profiles for a locale, keyed by URL slug.
 */
export async function getLocalizedAuthorProfiles(locale: Locale) {
  const entries = await getCollection('authors');
  const map = new Map<string, AuthorProfileEntry>();

  for (const entry of entries) {
    const parsed = splitLocaleFromAuthorsId(entry.id);
    if (parsed.locale !== locale) continue;
    const slug = getProfileSlug(entry.id);
    if (!slug || map.has(slug)) continue;
    map.set(slug, entry);
  }

  return map;
}
