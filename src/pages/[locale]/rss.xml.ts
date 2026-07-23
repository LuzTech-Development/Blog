import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { getSortedPosts } from '@/utils/getSortedPosts';
import { getLocalizedPosts } from '@/utils/getLocalizedPosts';
import { getPostUrl } from '@/utils/getPostPaths';
import { assertLocaleParam, getStaticLocalePaths } from '@/utils/i18n';
import config from '@/config';

export const getStaticPaths = getStaticLocalePaths;

/** Escape a string so it's safe to embed as XML text or an attribute value. */
function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export const GET: APIRoute = async ({ params }) => {
  const locale = assertLocaleParam(params.locale);
  const posts = await getLocalizedPosts(locale);
  const sortedPosts = getSortedPosts(posts);
  const siteBase = config.site.url;

  return rss({
    title: config.site.title,
    description: config.site.description,
    site: siteBase,
    // `dc:creator` is the portable way to expose a plain author name — RSS
    // 2.0's own <author> is spec'd as an email address, so most readers use
    // <dc:creator> for the byline UI. `media:thumbnail` is the de-facto tag
    // readers pick up as the *item's* preview image (Feedly/Inoreader render
    // it as the card artwork).
    xmlns: {
      dc: 'http://purl.org/dc/elements/1.1/',
      media: 'http://search.yahoo.com/mrss/'
    },
    items: sortedPosts.map(({ data, id, filePath }) => {
      const authorName = data.author ?? config.site.author;
      const authorEmail = data.authorEmail ?? undefined;

      const postUrl = getPostUrl(id, filePath, locale);

      // Resolve the item's preview image (article artwork, NOT the author
      // avatar — that's what media:thumbnail is for per the MRSS spec):
      //   1) explicit `ogImage` from the frontmatter (either an imported
      //      asset with a `.src` or a raw string path);
      //   2) otherwise, the auto-generated OG image at `{postUrl}/index.png`
      //      when `features.dynamicOgImage` is enabled — this mirrors the
      //      logic in `src/pages/[locale]/posts/[...slug]/index.astro`.
      let itemImage: string | undefined;
      const rawOg = data.ogImage;
      if (typeof rawOg === 'string') {
        itemImage = rawOg;
      } else if (rawOg && typeof rawOg === 'object' && 'src' in rawOg) {
        itemImage = (rawOg as { src: string }).src;
      }
      if (!itemImage && config.features.dynamicOgImage) {
        itemImage = `${postUrl.replace(/\/+$/, '')}/index.png`;
      }
      const itemImageAbs = itemImage
        ? new URL(itemImage, siteBase).href
        : undefined;

      const customDataParts = [
        `<dc:creator>${escapeXml(authorName)}</dc:creator>`
      ];
      if (itemImageAbs) {
        customDataParts.push(
          `<media:thumbnail url="${escapeXml(itemImageAbs)}" />`
        );
      }

      return {
        link: postUrl,
        title: data.title,
        description: data.description,
        pubDate: new Date(data.modDatetime ?? data.pubDatetime),
        // RSS 2.0's <author> is spec'd as "email (Name)". Beyond the byline,
        // several readers (Feedly, Inoreader) auto-resolve the email to a
        // Gravatar avatar — this is the closest thing to a de-facto standard
        // for surfacing the author's photo in RSS. Skipped when we have no
        // email so we don't emit a bare "(Name)" that some validators reject.
        author: authorEmail ? `${authorEmail} (${authorName})` : undefined,
        customData: customDataParts.join('')
      };
    })
  });
};
