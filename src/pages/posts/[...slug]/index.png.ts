import type { APIRoute } from "astro";
import { readFile } from "node:fs/promises";
import { getCollection } from "astro:content";
import satori from "satori";
import sharp from "sharp";
import { getPostSlug } from "@/utils/getPostPaths";
import config from "@/config";

export async function getStaticPaths() {
  if (!config.features.dynamicOgImage) {
    return [];
  }

  const posts = await getCollection("posts").then(p =>
    p.filter(({ data }) => !data.draft && !data.ogImage)
  );

  return posts.map(post => ({
    params: { slug: getPostSlug(post.id, post.filePath) },
    props: post,
  }));
}

export const GET: APIRoute = async ({ props }) => {
  if (!config.features.dynamicOgImage) {
    return new Response(null, { status: 404, statusText: "Not found" });
  }

  const [regularBuffer, boldBuffer] = await Promise.all([
    readFile("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"),
    readFile("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"),
  ]);
  const regularData = regularBuffer.buffer.slice(
    regularBuffer.byteOffset,
    regularBuffer.byteOffset + regularBuffer.byteLength
  );
  const boldData = boldBuffer.buffer.slice(
    boldBuffer.byteOffset,
    boldBuffer.byteOffset + boldBuffer.byteLength
  );

  const svg = await satori(
    {
      type: "div",
      props: {
        style: {
          background:
            "linear-gradient(135deg, #00ff9d 0%, #69dd96 28%, #4665c3 64%, #1f6fef 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "48px",
          color: "#ffffff",
          fontFamily: "DejaVu Sans",
        },
        children: {
          type: "div",
          props: {
            style: {
              width: "100%",
              height: "100%",
              borderRadius: "32px",
              border: "2px solid rgba(255,255,255,0.35)",
              background: "rgba(11, 16, 32, 0.22)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: "56px",
            },
            children: [
              {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                  },
                  children: [
                    {
                      type: "p",
                      props: {
                        style: {
                          fontSize: 68,
                          fontWeight: 800,
                          margin: 0,
                          lineHeight: 1.1,
                          maxHeight: "360px",
                          overflow: "hidden",
                        },
                        children: props.data.title,
                      },
                    },
                    {
                      type: "p",
                      props: {
                        style: {
                          fontSize: 30,
                          margin: 0,
                          maxWidth: "900px",
                          color: "rgba(255,255,255,0.92)",
                        },
                        children: props.data.description,
                      },
                    },
                  ],
                },
              },
              {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                    fontSize: 26,
                    fontWeight: 700,
                  },
                  children: [
                    {
                      type: "span",
                      props: {
                        children: props.data.author,
                      },
                    },
                    {
                      type: "span",
                      props: {
                        children: config.site.title,
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      },
    },
    {
      width: 1200,
      height: 630,
      embedFont: true,
      fonts: [
        {
          name: "DejaVu Sans",
          data: regularData,
          weight: 400,
          style: "normal",
        },
        {
          name: "DejaVu Sans",
          data: boldData,
          weight: 800,
          style: "normal",
        },
      ],
    }
  );

  const pngBuffer = await sharp(Buffer.from(svg)).png().toBuffer();

  return new Response(new Uint8Array(pngBuffer), {
    headers: { "Content-Type": "image/png" },
  });
};
