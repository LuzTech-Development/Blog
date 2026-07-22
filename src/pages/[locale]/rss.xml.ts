import rss from "@astrojs/rss";
import type { APIRoute } from "astro";
import { getSortedPosts } from "@/utils/getSortedPosts";
import { getLocalizedPosts } from "@/utils/getLocalizedPosts";
import { getPostUrl } from "@/utils/getPostPaths";
import { assertLocaleParam, getStaticLocalePaths } from "@/utils/i18n";
import config from "@/config";

export const getStaticPaths = getStaticLocalePaths;

export const GET: APIRoute = async ({ params }) => {
  const locale = assertLocaleParam(params.locale);
  const posts = await getLocalizedPosts(locale);
  const sortedPosts = getSortedPosts(posts);

  return rss({
    title: config.site.title,
    description: config.site.description,
    site: config.site.url,
    items: sortedPosts.map(({ data, id, filePath }) => ({
      link: getPostUrl(id, filePath, locale),
      title: data.title,
      description: data.description,
      pubDate: new Date(data.modDatetime ?? data.pubDatetime),
    })),
  });
};
