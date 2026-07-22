import satori from "satori";
import { SITE } from "@/config";
import loadGoogleFonts from "../loadGoogleFont";

export default async () => {
  return satori(
    {
      type: "div",
      props: {
        style: {
          background: "linear-gradient(135deg, #00ff9d 0%, #69dd96 28%, #4665c3 64%, #1f6fef 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "48px",
          color: "#ffffff",
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
                        style: { fontSize: 72, fontWeight: 800, margin: 0 },
                        children: SITE.title,
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
                        children: SITE.desc,
                      },
                    },
                  ],
                },
              },
              {
                type: "p",
                props: {
                  style: {
                    fontSize: 28,
                    fontWeight: 700,
                    margin: 0,
                  },
                  children: new URL(SITE.website).hostname,
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
      fonts: await loadGoogleFonts(SITE.title + SITE.desc + SITE.website),
    }
  );
};
