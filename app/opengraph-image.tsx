import { ImageResponse } from "next/og"

export const size = { width: 1200, height: 630 }
export const contentType = "image/png"
export const alt = "WeatherNet - Advanced Weather Network"

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          backgroundColor: "#0a0a0a",
          backgroundImage: "linear-gradient(135deg, #101010 0%, #1e1e1e 100%)",
          color: "#ffffff",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 220,
            height: 220,
            borderRadius: 48,
            backgroundColor: "#ffffff",
            color: "#0a0a0a",
            fontSize: 140,
            fontWeight: 700,
          }}
        >
          W
        </div>
        <div style={{ fontSize: 96, fontWeight: 700, marginTop: 48 }}>WeatherNet</div>
        <div style={{ fontSize: 40, color: "#a3a3a3", marginTop: 16 }}>
          Real-time weather, forecasts and air quality
        </div>
      </div>
    ),
    size,
  )
}
