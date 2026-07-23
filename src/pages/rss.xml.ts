/**
 * Root RSS entry point.
 *
 * The actual per-locale feeds live at `/en-us/rss.xml` and `/pt-br/rss.xml`
 * (see `src/pages/[locale]/rss.xml.ts`). This endpoint mirrors the root
 * landing page (`src/pages/index.astro`) and returns a tiny HTML document
 * that redirects the visitor to the feed matching their preferred locale.
 *
 * Feed readers should discover the correct feed through the
 * `<link rel="alternate" type="application/rss+xml">` tag on every localized
 * page, so hitting `/rss.xml` directly is a browser-driven action.
 *
 * The file is intentionally named `rss.xml` so users who type the URL by
 * memory (or click a stale bookmark) still end up on the right feed.
 */

import type { APIRoute } from 'astro';
import {
  LOCALES,
  LOCALE_URL_PATH,
  DEFAULT_LOCALE,
  LOCALE_LABELS
} from '@/utils/i18n';
import config from '@/config';

const defaultTarget = `/${LOCALE_URL_PATH[DEFAULT_LOCALE]}/rss.xml`;
const supportedJson = JSON.stringify(LOCALE_URL_PATH);
const title = `${config.site.title} — RSS`;

const alternates = LOCALES.map(locale => ({
  hreflang: locale,
  href: `/${LOCALE_URL_PATH[locale]}/rss.xml`,
  label: LOCALE_LABELS[locale]
}));

const html = /* html */ `<!doctype html>
<html lang="${DEFAULT_LOCALE}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content="noindex" />
    <title>${title}</title>
${alternates
  .map(
    alt =>
      `    <link rel="alternate" type="application/rss+xml" hreflang="${alt.hreflang}" href="${alt.href}" title="${title} (${alt.label})" />`
  )
  .join('\n')}
    <link rel="alternate" type="application/rss+xml" hreflang="x-default" href="${defaultTarget}" title="${title}" />
    <meta http-equiv="refresh" content="0; url=${defaultTarget}" />
    <script>
      (function () {
        try {
          var localeToPath = ${supportedJson};
          var stored = null;
          try { stored = localStorage.getItem("preferred-locale"); } catch (_) {}
          function pick(tag) {
            if (!tag) return null;
            if (localeToPath[tag]) return tag;
            var lower = tag.toLowerCase();
            if (lower.indexOf("pt") === 0) return "pt-BR";
            if (lower.indexOf("en") === 0) return "en-US";
            return null;
          }
          var target = pick(stored);
          if (!target) {
            var candidates =
              (navigator.languages && navigator.languages.length
                ? navigator.languages
                : [navigator.language]) || [];
            for (var i = 0; i < candidates.length; i++) {
              target = pick(candidates[i]);
              if (target) break;
            }
          }
          if (!target) target = "en-US";
          var path = localeToPath[target] || target.toLowerCase();
          location.replace("/" + path + "/rss.xml");
        } catch (_) {
          location.replace(${JSON.stringify(defaultTarget)});
        }
      })();
    </script>
  </head>
  <body>
    <noscript>
      <h1>${title}</h1>
      <p>Select a feed / Selecione um feed:</p>
      <ul>
${alternates
  .map(alt => `        <li><a href="${alt.href}">${alt.label}</a></li>`)
  .join('\n')}
      </ul>
    </noscript>
  </body>
</html>
`;

export const GET: APIRoute = () =>
  new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8'
    }
  });
