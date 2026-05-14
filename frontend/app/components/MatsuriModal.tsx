"use client";

import { useEffect } from "react";
import { Matsuri } from "../lib/api";

interface Props {
    matsuri: Matsuri;
    onClose: () => void;
}

export default function MatsuriModal({ matsuri: m, onClose }: Props) {
    const images = m.imageUrls
    ?.split(",")
    .filter(Boolean)
    .filter(url => !url.includes("link_languages")) || [];
    
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [onClose]);

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = ""; };
    }, []);

    return (
        <>
            {/* 배경 오버레이 */}
            <div
                onClick={onClose}
                style={{
                    position: "fixed", inset: 0,
                    background: "rgba(26, 20, 16, 0.7)",
                    zIndex: 100,
                    backdropFilter: "blur(4px)",
                }}
            />

            {/* 모달 */}
            <div style={{
                position: "fixed",
                top: "50%", left: "50%",
                transform: "translate(-50%, -50%)",
                width: "min(900px, 92vw)",
                maxHeight: "88vh",
                overflowY: "auto",
                zIndex: 101,
                borderRadius: 4,
            }}>
                <div className="washi-card" style={{ overflow: "hidden" }}>

                    {/* 상단 이미지 */}
                    {images.length > 0 && (
                        <div style={{
                            height: 280,
                            background: "#FFFFFF",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            overflow: "hidden",
                        }}>
                            <img
                                src={images[0]}
                                alt={m.nameKo}
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "contain",
                                }}
                            />
                        </div>
                    )}

                    {/* 콘텐츠 */}
                    <div style={{ padding: "36px 40px 40px", position: "relative" }}>

                        {/* 닫기 버튼 */}
                        <button
                            onClick={onClose}
                            style={{
                                position: "absolute", top: 16, right: 16,
                                width: 36, height: 36, borderRadius: "50%",
                                border: "1px solid var(--washi-edge)",
                                background: "rgba(243, 234, 216, 0.92)",
                                fontSize: 18, cursor: "pointer",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                zIndex: 10,
                            }}
                        >✕</button>

                        {/* 도시 뱃지 */}
                        <div style={{
                            display: "inline-block",
                            background: "var(--red)",
                            color: "var(--washi)",
                            fontSize: 11, fontWeight: 600,
                            padding: "3px 10px", borderRadius: 2,
                            marginBottom: 12,
                            letterSpacing: "0.05em",
                        }}>
                            📍 {m.cityKo}
                        </div>

                        {/* 제목 */}
                        <h2 style={{
                            fontSize: 28, fontWeight: 700,
                            lineHeight: 1.4, marginBottom: 8,
                        }}>
                            {m.nameKo}
                        </h2>

                        <div style={{ width: 80, marginBottom: 24 }}>
                            <span className="brush-line" />
                        </div>

                        {/* 기본 정보 */}
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "80px 1fr",
                            gap: "12px 16px",
                            fontSize: 14,
                            marginBottom: 28,
                            padding: "20px 24px",
                            background: "rgba(168, 127, 62, 0.06)",
                            borderRadius: 4,
                            border: "1px solid var(--washi-edge)",
                        }}>
                            {m.eventDatesKo && (
                                <>
                                    <div style={{ color: "var(--ink-faint)", fontWeight: 600 }}>📅 기간</div>
                                    <div style={{ fontWeight: 600, color: "var(--red-deep)" }}>{m.eventDatesKo}</div>
                                </>
                            )}
                            {m.eventTimeKo && (
                                <>
                                    <div style={{ color: "var(--ink-faint)", fontWeight: 600 }}>🕐 시간</div>
                                    <div>{m.eventTimeKo}</div>
                                </>
                            )}
                            {m.venueKo && (
                                <>
                                    <div style={{ color: "var(--ink-faint)", fontWeight: 600 }}>🏛 장소</div>
                                    <div>{m.venueKo}</div>
                                </>
                            )}
                            {m.addressKo && (
                                <>
                                    <div style={{ color: "var(--ink-faint)", fontWeight: 600 }}>🗺 주소</div>
                                    <div>{m.addressKo}</div>
                                </>
                            )}
                            {m.contact && (
                                <>
                                    <div style={{ color: "var(--ink-faint)", fontWeight: 600 }}>📞 문의</div>
                                    <div>
                                        {m.contact
                                            .split(/[・\/／\s]/)
                                            .filter(s => /[\d\-\(\)０-９]+/.test(s))
                                            .join(" / ") || m.contact}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* 상세 설명 */}
                        {m.longDescKo && (
                            <div style={{ marginBottom: 28 }}>
                                <h3 style={{
                                    fontSize: 16, fontWeight: 700,
                                    marginBottom: 12,
                                    fontFamily: "Shippori Mincho, serif",
                                }}>소개</h3>
                                <div style={{ fontSize: 14, lineHeight: 1.9, color: "var(--sumi-2)" }}>
                                    {m.longDescKo
                                        .split(/(?<=[。！？\.\!\?])\s*/)
                                        .filter(Boolean)
                                        .map((sentence, i) => (
                                            <p key={i} style={{ marginBottom: 8 }}>
                                                {sentence}
                                            </p>
                                        ))
                                    }
                                </div>
                            </div>
                        )}

                        {/* 교통편 */}
                        {(m.accessTrainKo || m.accessCarKo) && (
                            <div style={{ marginBottom: 28 }}>
                                <h3 style={{
                                    fontSize: 16, fontWeight: 700,
                                    marginBottom: 12,
                                    fontFamily: "Shippori Mincho, serif",
                                }}>교통편</h3>
                                <div style={{
                                    display: "flex", flexDirection: "column", gap: 10,
                                    fontSize: 14, lineHeight: 1.7,
                                }}>
                                    {m.accessTrainKo && (
                                        <div style={{ display: "flex", gap: 10 }}>
                                            <span style={{ color: "var(--indigo)", fontWeight: 600, flexShrink: 0 }}>🚃 전철</span>
                                            <span style={{ color: "var(--sumi-2)" }}>{m.accessTrainKo}</span>
                                        </div>
                                    )}
                                    {m.accessCarKo && (
                                        <div style={{ display: "flex", gap: 10 }}>
                                            <span style={{ color: "var(--indigo)", fontWeight: 600, flexShrink: 0 }}>🚗 자동차</span>
                                            <span style={{ color: "var(--sumi-2)" }}>{m.accessCarKo}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* 관련 링크 */}
                        {m.relatedUrl && (
                            <a
                                href={m.relatedUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: 8,
                                    textDecoration: "none",
                                    fontSize: 13,
                                    padding: "10px 24px",
                                    background: "var(--red)",
                                    color: "var(--washi)",
                                    border: "1px solid var(--red-deep)",
                                    borderRadius: 2,
                                    cursor: "pointer",
                                }}
                            >
                                공식 사이트 보기 →
                            </a>
                        )}
                        {/* 구글맵 */}
                        {(m.addressKo || m.venueKo) && (
                            <div style={{ marginTop: 28 }}>
                                <h3 style={{
                                    fontSize: 16, fontWeight: 700,
                                    marginBottom: 12,
                                    fontFamily: "Shippori Mincho, serif",
                                }}>지도</h3>
                                <iframe
                                    width="100%"
                                    height="300"
                                    style={{ border: 0, borderRadius: 4 }}
                                    loading="lazy"
                                    allowFullScreen
                                    referrerPolicy="no-referrer-when-downgrade"
                                    src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent((m.venueKo || "") + " " + (m.addressKo || "") + " 愛知県")}&language=ko`}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}