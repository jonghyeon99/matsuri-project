"use client";

import { Matsuri } from "../lib/api";

interface Props {
  matsuri: Matsuri;
  onClick?: () => void;
  compact?: boolean;
}

export default function MatsuriCard({ matsuri: m, onClick, compact }: Props) {
  const imageUrl = m.imageUrls?.split(",")[0] || "";

  return (
    <div
      className="washi-card fade-up"
      onClick={onClick}
      style={{
        cursor: onClick ? "pointer" : "default",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.2s, box-shadow 0.2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.boxShadow = "0 2px 0 rgba(26,20,16,0.05), 0 22px 36px -16px rgba(26,20,16,0.35)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "";
        e.currentTarget.style.boxShadow = "";
      }}
    >
      {/* 이미지 영역 */}
      <div style={{
        height: compact ? 130 : 170,
        position: "relative",
        background: imageUrl
          ? `url(${imageUrl}) center/cover no-repeat`
          : "linear-gradient(135deg, #b6332b 0%, #8a1f1a 100%)",
        overflow: "hidden",
      }}>
        <div className="scrim" />

        {/* 종료 여부 뱃지 */}
        {m.isEnded === 1 && (
          <div style={{
            position: "absolute", top: 10, left: 10,
            background: "rgba(26,20,16,0.7)",
            color: "var(--washi)",
            fontSize: 10, padding: "3px 8px",
            borderRadius: 2,
          }}>종료</div>
        )}

        {/* 이름 */}
        <div style={{
          position: "absolute", left: 14, bottom: 12, right: 14,
          color: "var(--washi)",
        }}>
          <div style={{ fontFamily: "Shippori Mincho, serif", fontSize: 11, opacity: 0.85, letterSpacing: "0.1em" }}>
            {m.nameJp}
          </div>
          <div style={{ fontSize: compact ? 15 : 17, fontWeight: 700, marginTop: 2, lineHeight: 1.3 }}>
            {m.nameKo}
          </div>
        </div>
      </div>

      {/* 카드 내용 */}
      <div style={{ padding: "14px 16px 16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
          <div style={{ fontSize: 12, color: "var(--red-deep)", fontWeight: 600 }}>
            📅 {m.eventDatesKo || m.eventDatesJp || "-"}
          </div>
          <div style={{ fontSize: 11, color: "var(--ink-faint)" }}>
            📍 {m.cityKo || m.cityJp || "-"}
          </div>
        </div>
        <p style={{ fontSize: 12.5, lineHeight: 1.6, color: "var(--sumi-2)" }}>
          {m.shortDescKo || m.shortDescJp || ""}
        </p>
      </div>
    </div>
  );
}