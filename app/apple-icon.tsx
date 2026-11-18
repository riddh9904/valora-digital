import { ImageResponse } from "next/og";
import { site } from "@/config/site";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#FFFFFF", padding: 24 }}>
        <svg width="132" height="132" viewBox="0 0 64 64">
          <path d="M11 2h42l9 9v42l-9 9H11l-9-9V11z" fill={site.colors.ink} />
          <path d="M15 16h9l8 17.9L40 16h9L36 45h-8z" fill="#FFFFFF" />
        </svg>
      </div>
    ),
    size,
  );
}
