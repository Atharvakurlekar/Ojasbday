import { ImageResponse } from "next/og"
import { BIRTHDAY_NUMBER, BIRTHDAY_ORDINAL, RECIPIENT_NAME } from "@/lib/birthday"

export const runtime = "edge"
export const alt = `Letters For ${RECIPIENT_NAME} — Happy ${BIRTHDAY_ORDINAL} Birthday`
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OpenGraphImage() {
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
          background: "linear-gradient(180deg, #0a1218 0%, #152535 50%, #1e3248 100%)",
          fontFamily: "serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 60,
            background: "#060a0f",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 60,
            background: "#060a0f",
          }}
        />
        <p
          style={{
            color: "rgba(232,160,74,0.75)",
            fontSize: 18,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            marginBottom: 16,
          }}
        >
          A Birthday Film — Presented For
        </p>
        <h1
          style={{
            color: "#e8e4dc",
            fontSize: 64,
            fontWeight: 700,
            textAlign: "center",
            lineHeight: 1.1,
            margin: 0,
          }}
        >
          {BIRTHDAY_NUMBER} Letters From
        </h1>
        <p
          style={{
            color: "#e8a04a",
            fontSize: 48,
            fontStyle: "italic",
            marginTop: 8,
          }}
        >
          Your Loved Ones
        </p>
        <p
          style={{
            color: "rgba(232,160,74,0.65)",
            fontSize: 20,
            marginTop: 32,
            letterSpacing: "0.2em",
          }}
        >
          Happy {BIRTHDAY_ORDINAL} Birthday, {RECIPIENT_NAME}
        </p>
      </div>
    ),
    { ...size }
  )
}
