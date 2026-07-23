import { createHash } from 'node:crypto';

/**
 * Build a Gravatar image URL for the given email address.
 *
 * Gravatar identifies profiles by the SHA-256 hash of the lowercased, trimmed
 * email address (MD5 is still accepted but deprecated). We keep the hash
 * deterministic and stable so the same email always resolves to the same avatar.
 *
 * @param email  raw email address (case is irrelevant)
 * @param size   requested pixel size — pass `undefined` (or leave off) to omit
 *               the `?s=` parameter entirely and let the consumer (e.g. a feed
 *               reader) pick its own display size. Gravatar's default without
 *               `s=` is 80 px.
 * @param fallback  keyword passed as `?d=` — controls the fallback avatar shown
 *                  when the user has never registered on gravatar.com
 */
export function gravatarUrl(
  email: string | undefined | null,
  size?: number,
  fallback: 'identicon' | 'retro' | 'robohash' | 'mp' | 'wavatar' = 'identicon'
): string {
  const normalized = (email ?? '').trim().toLowerCase();
  const hash = createHash('sha256').update(normalized).digest('hex');
  const params = new URLSearchParams();
  if (typeof size === 'number') params.set('s', String(size));
  params.set('d', fallback);
  return `https://www.gravatar.com/avatar/${hash}?${params.toString()}`;
}

/**
 * Build a hi-DPI `srcset` value for a Gravatar image. The browser picks the
 * variant matching its device pixel ratio, so 1x screens don't waste bandwidth
 * downloading the 2x/3x images.
 *
 * @param email      raw email address
 * @param basePx     the display size in CSS pixels (matches the `width` attr)
 * @param densities  which pixel densities to emit (default: 1x, 2x, 3x)
 * @param fallback   `?d=` keyword forwarded to `gravatarUrl`
 */
export function gravatarSrcSet(
  email: string | undefined | null,
  basePx: number,
  densities: readonly number[] = [1, 2, 3],
  fallback: 'identicon' | 'retro' | 'robohash' | 'mp' | 'wavatar' = 'identicon'
): string {
  return densities
    .map(d => `${gravatarUrl(email, basePx * d, fallback)} ${d}x`)
    .join(', ');
}
