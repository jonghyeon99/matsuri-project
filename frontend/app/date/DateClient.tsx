"use client";

import { useState, useEffect } from "react";
import { Matsuri, fetchByDate } from "../lib/api";
import MatsuriCard from "../components/MatsuriCard";
import MatsuriModal from "../components/MatsuriModal";

function getTodayString() {
    const today = new Date();
    return today.toISOString().split("T")[0];
}

export default function DateClient() {
    const today = getTodayString();
    const [selectedDate, setSelectedDate] = useState<string>(today);
    const [matsuris, setMatsuris] = useState<Matsuri[]>([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const [openMatsuri, setOpenMatsuri] = useState<Matsuri | null>(null);

    // 처음 로드 시 오늘 날짜로 자동 검색
    useEffect(() => {
        handleSearch(today);
    }, []);

    const handleSearch = async (date?: string) => {
        const target = date || selectedDate;
        if (!target) return;
        setLoading(true);
        setSearched(true);
        try {
            const data = await fetchByDate(target);
            setMatsuris(data);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px 80px" }}>

            {/* 헤더 */}
            <div style={{ marginBottom: 32 }}>
                <div style={{
                    fontFamily: "Shippori Mincho, serif",
                    fontSize: 13, color: "var(--red-deep)",
                    letterSpacing: "0.4em", marginBottom: 6,
                }}>
                    日付から探す
                </div>
                <h1 style={{ fontSize: 36, fontWeight: 700, marginBottom: 10 }}>
                    날짜별로 찾기
                </h1>
                <div style={{ width: 80 }}><span className="brush-line" /></div>
                <p style={{ marginTop: 10, fontSize: 13, color: "var(--ink-faint)" }}>
                    여행 날짜를 선택하면 그날 열리는 마츠리를 볼 수 있어요.
                </p>
            </div>

            {/* 날짜 선택 */}
            <div className="washi-card" style={{
                padding: "32px 40px",
                marginBottom: 40,
                display: "flex",
                alignItems: "center",
                gap: 20,
            }}>
                <div style={{ fontFamily: "Shippori Mincho, serif", fontSize: 15, fontWeight: 600 }}>
                    날짜 선택
                </div>
                <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    onClick={(e) => (e.currentTarget as HTMLInputElement).showPicker()}
                    min="2025-01-01"
                    max="2026-12-31"
                    style={{
                        border: "1px solid var(--washi-edge)",
                        background: "var(--washi)",
                        padding: "10px 16px",
                        fontSize: 15,
                        fontFamily: "inherit",
                        borderRadius: 2,
                        cursor: "pointer",
                        color: "var(--sumi)",
                        width: 200,
                        colorScheme: "light",
                    }}
                />
                <button
                    className="btn primary"
                    onClick={() => handleSearch()}
                    style={{ padding: "10px 28px", fontSize: 14 }}
                >
                    검색
                </button>
            </div>

            {/* 결과 */}
            {searched && (
                <>
                    <div style={{ marginBottom: 24 }}>
                        <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
                            <h2 style={{ fontSize: 28, fontWeight: 700 }}>
                                {selectedDate} 마츠리
                            </h2>
                            <div style={{
                                fontFamily: "Shippori Mincho, serif",
                                fontSize: 14, color: "var(--red-deep)",
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
                            <div>해당 날짜에 열리는 마츠리가 없어요.</div>
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