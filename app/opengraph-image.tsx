import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Tindivo — Se viene algo muy pronto";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 88px",
          background:
            "linear-gradient(135deg, #F97316 0%, #EA580C 60%, #C2410C 100%)",
          color: "#FFFFFF",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 22,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            opacity: 0.85,
          }}
        >
          <span>San Jacinto · Áncash</span>
          <span>2026</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: 230,
              fontWeight: 700,
              lineHeight: 0.9,
              letterSpacing: "-0.04em",
              display: "flex",
              alignItems: "flex-end",
            }}
          >
            tindivo
            <span style={{ color: "#FBBF24", marginLeft: 4 }}>.</span>
          </div>
          <div
            style={{
              fontSize: 56,
              fontWeight: 500,
              lineHeight: 1.05,
              maxWidth: 900,
              opacity: 0.95,
            }}
          >
            Se viene algo muy pronto.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 20,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            opacity: 0.8,
          }}
        >
          <span>Delivery hiperlocal</span>
          <span>Hecho con 🍕 desde acá</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
