import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#fafafa",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            fontSize: 160,
            fontWeight: 800,
            color: "#0f172a",
            letterSpacing: "-0.04em",
          }}
        >
          <span>IT</span>
          <span style={{ color: "#0d9488" }}>.</span>
        </div>
        <div
          style={{
            marginTop: 24,
            fontSize: 36,
            fontWeight: 500,
            color: "#475569",
          }}
        >
          CodeGetIt — Modern Web Development
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
