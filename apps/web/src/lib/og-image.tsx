import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { profile } from "@portfolio/content";
import { site } from "@/lib/site";

export const ogSize = { width: 1200, height: 630 };

// Satori can't read CSS variables.
const colors = {
  bg: "#0c0d10",
  fg: "#ededf0",
  muted: "#9a9da8",
  accent: "#7d8bff",
};

// Sync on purpose: an async read stops prerendering under Cache Components.
const fontDir = join(process.cwd(), "assets/fonts");
const fonts = {
  wide: readFileSync(join(fontDir, "Archivo-ExpandedExtraBold.ttf")),
  regular: readFileSync(join(fontDir, "Archivo-Regular.ttf")),
  mono: readFileSync(join(fontDir, "JetBrainsMono-Medium.ttf")),
};

type OgImageProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function renderOgImage({ eyebrow, title, description }: OgImageProps) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: colors.bg,
          color: colors.fg,
          fontFamily: "Archivo",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontFamily: "JetBrains Mono",
              fontSize: 22,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: colors.muted,
            }}
          >
            {eyebrow}
          </div>
          <div
            style={{
              marginTop: 20,
              fontFamily: "Archivo Expanded",
              fontSize: title.length > 14 ? 76 : 104,
              lineHeight: 0.92,
              letterSpacing: "-0.03em",
              textTransform: "uppercase",
            }}
          >
            {title}
          </div>
          <div style={{ marginTop: 32, maxWidth: 1000, fontSize: 40, lineHeight: 1.25, color: colors.fg }}>
            {description}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: `3px solid ${colors.fg}`,
            paddingTop: 28,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 14, height: 14, borderRadius: 7, background: colors.accent }} />
            <div style={{ fontFamily: "Archivo Expanded", fontSize: 26, textTransform: "uppercase" }}>
              {profile.name}
            </div>
          </div>
          <div style={{ fontFamily: "JetBrains Mono", fontSize: 22, color: colors.muted }}>{site.url.host}</div>
        </div>
      </div>
    ),
    {
      ...ogSize,
      fonts: [
        { name: "Archivo Expanded", data: fonts.wide, weight: 800, style: "normal" },
        { name: "Archivo", data: fonts.regular, weight: 400, style: "normal" },
        { name: "JetBrains Mono", data: fonts.mono, weight: 500, style: "normal" },
      ],
    },
  );
}
