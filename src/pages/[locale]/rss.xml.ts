import rss from "@astrojs/rss";
import type { APIRoute } from "astro";
import { getSortedPosts } from "@/utils/getSortedPosts";
import { getLocalizedPosts } from "@/utils/getLocalizedPosts";
import { getPostUrl } from "@/utils/getPostPaths";
import { assertLocaleParam, getStaticLocalePaths } from "@/utils/i18n";
import { gravatarUrl } from "@/utils/gravatar";
import config from "@/config";

export const getStaticPaths = getStaticLocalePaths;

/** Escape a string so it's safe to embed as XML text or an attribute value. */
function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export const GET: APIRoute = async ({ params }) => {
  const locale = assertLocaleParam(params.locale);
  const posts = await getLocalizedPosts(locale);
  const sortedPosts = getSortedPosts(posts);

  return rss({
    title: config.site.title,
    description: config.site.description,
    site: config.site.url,
    // Extra namespaces used by per-item customData below. `dc:creator` is the
    // portable way to expose a plain author name (RSS 2.0's <author> is
    // technically an email address), and `media:thumbnail` is the de-facto
    // standard readers look for when picking an author avatar.
    xmlns: {
      dc: "http://purl.org/dc/elements/1.1/",
      media: "http://search.yahoo.com/mrss/",
    },
    items: sortedPosts.map(({ data, id, filePath }) => {
      const authorName = data.author ?? config.site.author;
      const authorEmail = data.authorEmail ?? undefined;
      // Omit `?s=` so each reader picks its own display size.
      const avatarUrl = gravatarUrl(authorEmail);

      const customDataParts = [
        `<dc:creator>${escapeXml(authorName)}</dc:creator>`,
        `<media:thumbnail url="${escapeXml(avatarUrl)}" />`,
      ];

      return {
        link: getPostUrl(id, filePath, locale),
        title: data.title,
        description: data.description,
        pubDate: new Date(data.modDatetime ?? data.pubDatetime),
        // RSS 2.0's <author> field spec is "email (Name)" — most readers show
        // it verbatim. Skip it when we have no email so we don't emit a
        // bare "(Name)" that some validators reject.
        author: authorEmail ? `${authorEmail} (${authorName})` : undefined,
        customData: customDataParts.join(""),
      };
    }),
  });
};
