"use client";

import { useState, useEffect } from "react";
import { Matsuri } from "../lib/api";

interface Props {
    matsuris: Matsuri[];
    onOpen?: (m: Matsuri) => void;
}

export default function MatsuriSlider({ matsuris, onOpen }: Props) {
    const [idx, setIdx] = useState(0);
    const [paused, setPaused] = useState(false);

    useEffect(() => {
        if (paused || matsuris.length === 0) return;
        const t = setInterval(() => setIdx(i => (i + 1) % matsuris.length), 5500);
        return () => clearInterval(t);
    }, [paused, matsuris.length]);

    if (matsuris.length === 0) return null;
    const m = matsuris[idx];
    const imageUrl = m.imageUrls?.split(",")[0] || "";

    return (
        <div
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            style={{ position: "relative", marginBottom: 14 }}
        >
            {/* 카운터 */}
            <div style={{
                position: "absolute",
                top: -28,
                right: 0,
                fontSize: 12,
                color: "var(--ink-faint)",
            }}>
                {idx + 1} / {matsuris.length}
            </div>

            {/* 슬라이드 카드 */}
            <div
                className="washi-card scale-in"
                onClick={() => onOpen?.(m)}
                style={{
                    display: "flex",
                    overflow: "hidden",
                    height: 420,
                    cursor: onOpen ? "pointer" : "default",
                }}
            >
                {/* 이미지 영역 - 왼쪽 고정 너비 */}
                <div style={{
                    position: "relative",
                    width: 420,
                    height: 420,
                    flexShrink: 0,
                    background: "#FFFFFF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                }}>
                    {imageUrl && (
                        <img
                            src={imageUrl}
                            alt={m.nameKo}
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "contain",
                            }}
                        />
                    )}
                    {/* 랜턴 장식 */}
                    <div style={{
                        position: "absolute", left: 16, top: 0,
                        display: "flex", flexDirection: "column", alignItems: "center",
                        zIndex: 2,
                    }}>
                        <div style={{ width: 2, height: 36, background: "rgba(243,234,216,0.4)" }} />
                        <div style={{
                            width: 44, height: 56,
                            borderRadius: "40% 40% 50% 50% / 50%",
                            background: "linear-gradient(180deg, #d96256, #b6332b)",
                            border: "2px solid #f3ead8",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            color: "#f3ead8",
                            fontFamily: "Shippori Mincho, serif",
                            fontSize: 18,
                        }}>祭</div>
                    </div>
                </div>

                {/* 텍스트 영역 - 나머지 공간 전부 */}
                <div style={{
                    flex: 1,
                    padding: "40px 48px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    background: "linear-gradient(135deg, #faf3e1 0%, #f0e5cd 100%)",
                }}>
                    <h2 style={{
                        fontSize: 26,
                        fontWeight: 700,
                        lineHeight: 1.4,
                        marginBottom: 14,
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical" as const,
                        overflow: "hidden",
                    }}>
                        {m.nameKo}
                    </h2>
                    <div style={{ width: 60, marginBottom: 18 }}>
                        <span className="brush-line" />
                    </div>
                    <p style={{
                        fontSize: 13.5,
                        lineHeight: 1.8,
                        color: "var(--sumi-2)",
                        marginBottom: 24,
                        display: "-webkit-box",
                        WebkitLineClamp: 5,
                        WebkitBoxOrient: "vertical" as const,
                        overflow: "hidden",
                    }}>
                        {m.shortDescKo}
                    </p>
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "56px 1fr",
                        gap: "8px 12px",
                        fontSize: 13,
                    }}>
                        <div style={{ color: "var(--ink-faint)" }}>📅 기간</div>
                        <div style={{ fontWeight: 600 }}>{m.eventDatesKo || m.startDate}</div>
                        <div style={{ color: "var(--ink-faint)" }}>📍 장소</div>
                        <div>{m.cityKo}</div>
                    </div>
                </div>
            </div>

            {/* 이전 버튼 */}
            <button
                onClick={() => setIdx(i => (i - 1 + matsuris.length) % matsuris.length)}
                style={{
                    position: "absolute", top: "50%", transform: "translateY(-50%)",
                    left: 16, width: 44, height: 44, borderRadius: "50%",
                    border: "1px solid var(--washi-edge)",
                    background: "rgba(243, 234, 216, 0.92)",
                    fontSize: 26, cursor: "pointer", zIndex: 10,
                }}
            >‹</button>

            {/* 다음 버튼 */}
            <button
                onClick={() => setIdx(i => (i + 1) % matsuris.length)}
                style={{
                    position: "absolute", top: "50%", transform: "translateY(-50%)",
                    right: 16, width: 44, height: 44, borderRadius: "50%",
                    border: "1px solid var(--washi-edge)",
                    background: "rgba(243, 234, 216, 0.92)",
                    fontSize: 26, cursor: "pointer", zIndex: 10,
                }}
            >›</button>

            {/* 인디케이터 dots */}
            <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 14 }}>
                {matsuris.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setIdx(i)}
                        style={{
                            width: i === idx ? 28 : 8,
                            height: 8,
                            borderRadius: 4,
                            border: "none",
                            background: i === idx ? "var(--red)" : "var(--washi-edge)",
                            cursor: "pointer",
                            transition: "all 0.3s",
                        }}
                    />
                ))}
            </div>
        </div>
    );
}