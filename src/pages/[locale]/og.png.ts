import type { APIRoute } from 'astro';
import satori from 'satori';
import sharp from 'sharp';
import config from '@/config';
import { loadOgFonts } from '@/utils/ogFonts';
import { getStaticLocalePaths } from '@/utils/i18n';

export const getStaticPaths = getStaticLocalePaths;

export const GET: APIRoute = async () => {
  const fonts = await loadOgFonts();

  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          background:
            'linear-gradient(135deg, #00ff9d 0%, #69dd96 28%, #4665c3 64%, #1f6fef 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '48px',
          color: '#ffffff',
          fontFamily: 'Space Grotesk'
        },
        children: {
          type: 'div',
          props: {
            style: {
              width: '100%',
              height: '100%',
              borderRadius: '32px',
              border: '2px solid rgba(255,255,255,0.35)',
              background: 'rgba(11, 16, 32, 0.22)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '56px'
            },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px'
                  },
                  children: [
                    {
                      type: 'p',
                      props: {
                        style: { fontSize: 72, fontWeight: 700, margin: 0 },
                        children: config.site.title
                      }
                    },
                    {
                      type: 'p',
                      props: {
                        style: {
                          fontSize: 30,
                          margin: 0,
                          maxWidth: '900px',
                          color: 'rgba(255,255,255,0.92)'
                        },
                        children: config.site.description
                      }
                    }
                  ]
                }
              },
              {
                type: 'p',
                props: {
                  style: {
                    fontSize: 28,
                    fontWeight: 700,
                    margin: 0
                  },
                  children: new URL(config.site.url).hostname
                }
              }
            ]
          }
        }
      }
    },
    {
      width: 1200,
      height: 630,
      embedFont: true,
      fonts
    }
  );

  const pngBuffer = await sharp(Buffer.from(svg)).png().toBuffer();

  return new Response(new Uint8Array(pngBuffer), {
    headers: { 'Content-Type': 'image/png' }
  });
};
