import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "dles.fun - Your daily game dashboard";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  // Fetch JetBrains Mono font from GitHub (direct .ttf file)
  const jetBrainsMono = await fetch(
    new URL(
      "https://github.com/JetBrains/JetBrainsMono/raw/master/fonts/ttf/JetBrainsMono-Bold.ttf"
    )
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "#0a0a0a",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          fontFamily: '"JetBrains Mono"',
          position: "relative",
        }}
      >
        {/* Glow effect */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 700,
            height: 350,
            background:
              "radial-gradient(ellipse, rgba(249,115,22,0.15) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 40,
            zIndex: 10,
          }}
        >
          {/* Command input */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 24,
              color: "#737373",
            }}
          >
            <span style={{ color: "#16a34a" }}>➜</span>
            <span style={{ color: "#a3a3a3" }}>~/games</span>
            <span>bun run dles.fun</span>
          </div>

          {/* Main logo */}
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              padding: "8px 0",
            }}
          >
            <span
              style={{
                color: "#f97316",
                fontSize: 140,
                fontWeight: 700,
                marginRight: 16,
                lineHeight: 1,
                textShadow: "0 0 40px rgba(249,115,22,0.8)",
              }}
            >
              &gt;
            </span>
            <span
              style={{
                color: "white",
                fontSize: 140,
                fontWeight: 700,
                letterSpacing: "-0.05em",
                lineHeight: 1,
                textShadow: "0 0 40px rgba(255,255,255,0.4)",
              }}
            >
              dles
            </span>
            <span
              style={{
                color: "#f97316",
                fontSize: 140,
                fontWeight: 700,
                letterSpacing: "-0.05em",
                lineHeight: 1,
                textShadow: "0 0 40px rgba(249,115,22,0.8)",
              }}
            >
              .fun
            </span>
            <span
              style={{
                color: "#f97316",
                fontSize: 140,
                fontWeight: 700,
                marginLeft: 8,
                lineHeight: 1,
                textShadow: "0 0 40px rgba(249,115,22,0.8)",
              }}
            >
              _
            </span>
          </div>

          {/* Output lines */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 40,
              fontSize: 20,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                color: "#737373",
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#f97316"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="6" x2="10" y1="11" y2="11" />
                <line x1="8" x2="8" y1="9" y2="13" />
                <line x1="15" x2="15.01" y1="12" y2="12" />
                <line x1="18" x2="18.01" y1="10" y2="10" />
                <path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z" />
              </svg>
              <span>600+ daily games</span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                color: "#737373",
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#f97316"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
              </svg>
              <span>Real-time racing</span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                color: "#737373",
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#f97316"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
              <span>Track your stats</span>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "JetBrains Mono",
          data: jetBrainsMono,
          style: "normal",
          weight: 700,
        },
      ],
    }
  );
}
