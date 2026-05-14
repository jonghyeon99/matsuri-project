"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Matsuri, fetchByKeyword } from "../lib/api";
import MatsuriCard from "../components/MatsuriCard";
import MatsuriModal from "../components/MatsuriModal";

export default function SearchClient() {
    const searchParams = useSearchParams();
    const keyword = searchParams.get("keyword") || "";
    const [matsuris, setMatsuris] = useState<Matsuri[]>([]);
    const [loading, setLoading] = useState(false);
    const [openMatsuri, setOpenMatsuri] = useState<Matsuri | null>(null);

    useEffect(() => {
        if (!keyword) return;
        setLoading(true);
        fetchByKeyword(keyword)
            .then(data => setMatsuris(data.filter(m => m.shortDescKo && m.shortDescKo.trim() !== "")))
            .finally(() => setLoading(false));
    }, [keyword]);

    return (
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px 80px" }}>
            <div style={{ marginBottom: 32 }}>
                <div style={{
                    fontFamily: "Shippori Mincho, serif",
                    fontSize: 13, color: "var(--red-deep)",
                    letterSpacing: "0.4em", marginBottom: 6,
                }}>
                    検索結果
                </div>
                <h1 style={{ fontSize: 36, fontWeight: 700, marginBottom: 10 }}>
                    "{keyword}" 검색 결과
                </h1>
                <div style={{ width: 80 }}><span className="brush-line" /></div>
                <p style={{ marginTop: 10, fontSize: 13, color: "var(--ink-faint)" }}>
                    {loading ? "검색 중..." : `${matsuris.length}건 찾았어요.`}
                </p>
            </div>

            {loading ? (
                <div style={{ textAlign: "center", padding: 40, color: "var(--ink-faint)" }}>
                    불러오는 중...
                </div>
            ) : matsuris.length === 0 ? (
                <div className="washi-card" style={{ padding: 40, textAlign: "center", color: "var(--ink-faint)" }}>
                    <div style={{ fontSize: 36, marginBottom: 10 }}>🍵</div>
                    <div>검색 결과가 없어요.</div>
                </div>
            ) : (
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                    gap: 20,
                }}>
                    {matsuris.map(m => (
                        <MatsuriCard key={m.id} matsuri={m} onClick={() => setOpenMatsuri(m)} />
                    ))}
                </div>
            )}

            {openMatsuri && (
                <MatsuriModal matsuri={openMatsuri} onClose={() => setOpenMatsuri(null)} />
            )}
        </div>
    );
}