import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

const toArrayBuffer = (buffer: Buffer): ArrayBuffer =>
  buffer.buffer.slice(
    buffer.byteOffset,
    buffer.byteOffset + buffer.byteLength
  ) as ArrayBuffer;

export type OgFont = {
  name: "Space Grotesk";
  data: ArrayBuffer;
  weight: 400 | 700;
  style: "normal";
};

export async function loadOgFonts(): Promise<OgFont[]> {
  const [regular, bold] = await Promise.all([
    readFile(
      require.resolve(
        "@fontsource/space-grotesk/files/space-grotesk-latin-400-normal.woff"
      )
    ),
    readFile(
      require.resolve(
        "@fontsource/space-grotesk/files/space-grotesk-latin-700-normal.woff"
      )
    ),
  ]);

  return [
    {
      name: "Space Grotesk",
      data: toArrayBuffer(regular),
      weight: 400,
      style: "normal",
    },
    {
      name: "Space Grotesk",
      data: toArrayBuffer(bold),
      weight: 700,
      style: "normal",
    },
  ];
}
