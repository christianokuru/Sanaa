import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };

const STRIPES = ["#D93A16", "#F4A51C", "#191D57", "#0B8457", "#F4A51C", "#2747D8", "#E2477F", "#1A1A1A"];

/** Branded social share card: bold type on white with a kente-style band. */
export function renderOgImage({ eyebrow, title, footer }: { eyebrow: string; title: string; footer: string }) {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "#FFFFFF" }}>
        <div style={{ display: "flex", height: 28 }}>
          {Array.from({ length: 24 }, (_, i) => (
            <div key={i} style={{ flex: 1, background: STRIPES[i % STRIPES.length] }} />
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", flex: 1, padding: "64px 80px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: "#F0532B", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: 22, height: 22, background: "#FFFFFF", transform: "rotate(45deg)" }} />
            </div>
            <div style={{ fontSize: 40, fontWeight: 700, color: "#F0532B", letterSpacing: -1.5 }}>sanaa</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 28, color: "#D93A16", fontWeight: 600, textTransform: "uppercase", letterSpacing: 4 }}>{eyebrow}</div>
            <div style={{ fontSize: title.length > 40 ? 64 : 80, fontWeight: 700, color: "#1A1A1A", lineHeight: 1.02, letterSpacing: -3, marginTop: 16 }}>{title}</div>
          </div>
          <div style={{ fontSize: 28, color: "#6A6A6A" }}>{footer}</div>
        </div>
      </div>
    ),
    OG_SIZE,
  );
}
