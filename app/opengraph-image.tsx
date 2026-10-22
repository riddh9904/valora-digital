import { ImageResponse } from "next/og";
import { site } from "@/config/site";

export const alt = `${site.name}: Turn marketing spend into measurable growth`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  const bars = [0.32, 0.44, 0.4, 0.56, 0.52, 0.68, 0.64, 0.8, 0.9];
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
          background: "linear-gradient(135deg, #070B18 0%, #0E1530 60%, #1A1D4A 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: site.colors.accent, display: "flex" }} />
          <div style={{ fontSize: 34, fontWeight: 600, letterSpacing: -1 }}>{site.name}</div>
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
          <div style={{ display: "flex", flexDirection: "column", maxWidth: 720 }}>
            <div style={{ fontSize: 20, letterSpacing: 4, color: "#A9BDFF", textTransform: "uppercase" }}>
              Performance marketing · Conversion intelligence
            </div>
            <div style={{ fontSize: 72, fontWeight: 600, lineHeight: 1.02, letterSpacing: -2.5, marginTop: 20 }}>
              Turn marketing spend into measurable growth.
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 220 }}>
            {bars.map((h, i) => (
              <div
                key={i}
                style={{
                  width: 22,
                  height: 220 * h,
                  borderRadius: 5,
                  background: i === bars.length - 1 ? site.colors.accentBright : "rgba(169,189,255,0.28)",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
