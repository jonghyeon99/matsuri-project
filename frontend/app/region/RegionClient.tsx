"use client";

import { useState, useEffect } from "react";
import { Matsuri, fetchByCity } from "../lib/api";
import MatsuriCard from "../components/MatsuriCard";
import MatsuriModal from "../components/MatsuriModal";

interface Props {
    cities: string[];
}

export default function RegionClient({ cities }: Props) {
    const [selectedCity, setSelectedCity] = useState<string | null>(null);
    const [matsuris, setMatsuris] = useState<Matsuri[]>([]);
    const [loading, setLoading] = useState(false);
    const [openMatsuri, setOpenMatsuri] = useState<Matsuri | null>(null);

    useEffect(() => {
        if (!selectedCity) return;
        setLoading(true);
        fetchByCity(selectedCity)
            .then(setMatsuris)
            .finally(() => setLoading(false));
    }, [selectedCity]);

    return (
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px 80px" }}>

            {/* 헤더 */}
            <div style={{ marginBottom: 32 }}>
                <div style={{
                    fontFamily: "Shippori Mincho, serif",
                    fontSize: 13, color: "var(--red-deep)",
                    letterSpacing: "0.4em", marginBottom: 6,
                }}>
                    地域から探す
                </div>
                <h1 style={{ fontSize: 36, fontWeight: 700, marginBottom: 10 }}>
                    지역별로 찾기
                </h1>
                <div style={{ width: 80 }}><span className="brush-line" /></div>
                <p style={{ marginTop: 10, fontSize: 13, color: "var(--ink-faint)" }}>
                    아이치현 시정촌을 선택하면 해당 지역의 마츠리를 볼 수 있어요.
                </p>
            </div>

            {/* 도시 그리드 */}
            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
                gap: 12,
                marginBottom: 48,
            }}>
                {cities.map(city => (
                    <button
                        key={city}
                        onClick={() => setSelectedCity(city === selectedCity ? null : city)}
                        className={selectedCity === city ? "btn primary" : "btn"}
                        style={{
                            width: "100%",
                            padding: "12px 8px",
                            fontSize: 14,
                            fontWeight: selectedCity === city ? 700 : 400,
                            fontFamily: "Noto Sans KR, sans-serif",
                        }}
                    >
                        {city}
                    </button>
                ))}
            </div>

            {/* 선택된 도시 마츠리 목록 */}
            {selectedCity && (
                <>
                    <div style={{ marginBottom: 24 }}>
                        <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
                            <h2 style={{ fontSize: 28, fontWeight: 700 }}>
                                {selectedCity}의 마츠리
                            </h2>
                            <div style={{
                                fontFamily: "Shippori Mincho, serif",
                                fontSize: 14, color: "var(--red-deep)",
                                letterSpacing: "0.2em",
                            }}>
                                {matsuris.length}건
                            </div>
                        </div>
                        <div style={{ width: 80, marginTop: 6 }}>
                            <span className="brush-line" />
                        </div>
                    </div>

                    {loading ? (
                        <div style={{ textAlign: "center", padding: 40, color: "var(--ink-faint)" }}>
                            불러오는 중...
                        </div>
                    ) : matsuris.length === 0 ? (
                        <div className="washi-card" style={{ padding: 40, textAlign: "center", color: "var(--ink-faint)" }}>
                            <div style={{ fontSize: 36, marginBottom: 10 }}>🍵</div>
                            <div>해당 지역의 마츠리가 없어요.</div>
                        </div>
                    ) : (
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                            gap: 20,
                        }}>
                            {matsuris
                                .filter(m => m.shortDescKo && m.shortDescKo.trim() !== "")
                                .map(m => (
                                <MatsuriCard key={m.id} matsuri={m} onClick={() => setOpenMatsuri(m)} />
                            ))}
                        </div>
                    )}
                </>
            )}
            {openMatsuri && (
                <MatsuriModal matsuri={openMatsuri} onClose={() => setOpenMatsuri(null)} />
            )}
        </div>
    );
}