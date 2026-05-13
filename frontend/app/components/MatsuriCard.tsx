"use client";

import { Matsuri } from "../lib/api";

interface Props {
    matsuri: Matsuri;
    onClick?: () => void;
    compact?: boolean;
}

export default function MatsuriCard({ matsuri: m, onClick, compact }: Props) {
    const imageUrl = m.imageUrls
    ?.split(",")
    .filter(Boolean)
    .find(url => !url.includes("link_languages")) || "";

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
                background: "#FFFFFF",
                overflow: "hidden",
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}>
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={m.nameKo}
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                        }}
                    />
                ) : (
                    <div style={{
                        width: "100%",
                        height: "100%",
                        background: "linear-gradient(135deg, #b6332b 0%, #8a1f1a 100%)",
                    }} />
                )}
                {m.isEnded === 1 && (
                    <div style={{
                        position: "absolute", top: 10, left: 10,
                        background: "rgba(26,20,16,0.7)",
                        color: "var(--washi)",
                        fontSize: 10, padding: "3px 8px",
                        borderRadius: 2,
                    }}>종료</div>
                )}
            </div>

            {/* 카드 내용 */}
            <div style={{ padding: "14px 16px 16px", display: "flex", flexDirection: "column", flex: 1 }}>
                {/* 이름 - 2줄 말줄임 */}
                <div style={{
                    fontWeight: 700,
                    fontSize: 15,
                    lineHeight: 1.4,
                    minHeight: 42,
                    marginBottom: 10,
                    color: "var(--sumi)",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical" as const,
                    overflow: "hidden",
                }}>
                    {m.nameKo}
                </div>

                <div style={{ marginBottom: 8 }}>
                    {/* 날짜 */}
                    <div style={{ fontSize: 12, color: "var(--red-deep)", fontWeight: 600, marginBottom: 4 }}>
                        📅 {m.eventDatesKo || "-"}
                    </div>
                    {/* 도시 */}
                    <div style={{ fontSize: 11, color: "var(--ink-faint)", marginBottom: 8 }}>
                        📍 {m.cityKo || "-"}
                    </div>
                </div>

                {/* 설명 - 3줄 말줄임 */}
                <p style={{
                    fontSize: 12.5,
                    lineHeight: 1.6,
                    color: "var(--sumi-2)",
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical" as const,
                    overflow: "hidden",
                }}>
                    {m.shortDescKo || ""}
                </p>
            </div>
        </div>
    );
}