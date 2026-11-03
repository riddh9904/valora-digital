import { ImageResponse } from "next/og";
import { site } from "@/config/site";

export const alt = `${site.name}: AI-driven performance marketing, measured to the sale`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// next/font is unavailable here, so this uses the default font ImageResponse ships.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#FFFFFF",
          color: site.colors.ink,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <svg width="72" height="72" viewBox="0 0 64 64">
            <path d="M11 2h42l9 9v42l-9 9H11l-9-9V11z" fill={site.colors.ink} />
            <path d="M15 16h9l8 17.9L40 16h9L36 45h-8z" fill="#FFFFFF" />
          </svg>
          <div style={{ fontSize: 56, fontWeight: 600, letterSpacing: -2 }}>valora</div>
        </div>
        <div style={{ display: "flex", fontSize: 64, fontWeight: 500, lineHeight: 1.1, letterSpacing: -2, maxWidth: 980 }}>
          Ad platforms run on AI. We teach it what a customer is.
        </div>
        <div style={{ display: "flex", fontSize: 26, color: site.colors.graphite }}>
          valoradigital.co · Dubai · Gurugram
        </div>
      </div>
    ),
    size,
  );
}
