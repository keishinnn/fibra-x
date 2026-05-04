import { ImageResponse } from "next/og";

export const alt = "FibraX - Bitcoin Cycle Ratio Visualizer";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "56px",
          background: "linear-gradient(145deg, #050505 0%, #0f0f0f 55%, #1b1408 100%)",
          color: "#f4f4f5",
          fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            fontSize: 26,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#f7931a",
          }}
        >
          <div
            style={{
              height: "14px",
              width: "14px",
              borderRadius: "9999px",
              background: "#f7931a",
              boxShadow: "0 0 18px rgba(247, 147, 26, 0.5)",
            }}
          />
          FibraX
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <div style={{ fontSize: 68, fontWeight: 700, lineHeight: 1.05 }}>Bitcoin Cycle Research Dashboard</div>
          <div style={{ fontSize: 33, color: "#a1a1aa", lineHeight: 1.25 }}>
            Fibonacci ratio zones, cycle phases, and halving-aware scenario analysis.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 24,
            color: "#d4d4d8",
            borderTop: "1px solid rgba(247, 147, 26, 0.25)",
            paddingTop: "18px",
          }}
        >
          Educational and research use only. Not financial advice.
        </div>
      </div>
    ),
    { ...size },
  );
}
