import { ImageResponse } from "next/og";

import { profile } from "@/data/profile";

export const alt = `${profile.name}, ${profile.headline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Built from static profile data, so it prerenders at build time and needs no separate design file.
export default function OpenGraphImage(): ImageResponse {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          padding: 84,
          background: "#e7e7e4",
          color: "#0b0b0b",
        }}
      >
        <div style={{ display: "flex", fontSize: 30, color: "#d12b1f" }}>
          {profile.headline}
        </div>
        <div style={{ display: "flex", fontSize: 128, fontWeight: 700, letterSpacing: -4 }}>
          {profile.name}
        </div>
        <div style={{ display: "flex", fontSize: 32, color: "#4f4f4f" }}>
          {`${profile.location.city}, ${profile.location.country}`}
        </div>
      </div>
    ),
    { ...size },
  );
}
