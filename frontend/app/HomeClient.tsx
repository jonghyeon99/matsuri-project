"use client";

import { useState } from "react";
import { Matsuri } from "./lib/api";
import MatsuriSlider from "./components/MatsuriSlider";
import MatsuriCard from "./components/MatsuriCard";
import MatsuriModal from "./components/MatsuriModal";

interface Props {
    ongoing: Matsuri[];
    upcoming: Matsuri[];
}

export default function HomeClient({ ongoing, upcoming }: Props) {
    const [openMatsuri, setOpenMatsuri] = useState<Matsuri | null>(null);
    const sliderMatsuris = ongoing
                            .filter(m => m.shortDescKo && m.shortDescKo.trim() !== "")                                
                            .slice(0, 6);

    return (
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px 80px" }}>

            {/* 헤더 타이틀 */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 22 }}>
                <div>
                    <div style={{
                        fontFamily: "Shippori Mincho, serif",
                        fontSize: 13, color: "var(--red-deep)",
                        letterSpacing: "0.4em", marginBottom: 6,
                    }}>
                        開催中の祭 ・ 開催予定の祭
                    </div>
                    <h1 style={{ fontSize: 36, fontWeight: 700 }}>
                        지금 아이치에서 열리는 <span style={{ color: "var(--red)" }}>마츠리</span>
                    </h1>
                </div>
            </div>

            {/* 슬라이드쇼 */}
            {sliderMatsuris.length > 0 ? (
                <MatsuriSlider matsuris={sliderMatsuris} onOpen={setOpenMatsuri} />
            ) : (
                <div className="washi-card" style={{ padding: 40, textAlign: "center", color: "var(--ink-faint)", marginBottom: 60 }}>
                    <div style={{ fontSize: 36, marginBottom: 10 }}>🍵</div>
                    <div>현재 진행 중인 마츠리가 없어요.</div>
                </div>
            )}

            {/* 어떻게 찾으시겠어요? */}
            <div style={{ marginTop: 60, marginBottom: 28 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
                    <h2 style={{ fontSize: 32, fontWeight: 700 }}>어떻게 찾으시겠어요?</h2>
                    <div style={{ fontFamily: "Shippori Mincho, serif", fontSize: 16, color: "var(--red-deep)", letterSpacing: "0.2em" }}>
                        探し方を選ぶ
                    </div>
                </div>
                <div style={{ width: 80, marginTop: 6 }}><span className="brush-line" /></div>
                <p style={{ marginTop: 10, fontSize: 13, color: "var(--ink-faint)" }}>
                    지역으로 둘러보거나, 여행 날짜에 맞춰 마츠리를 골라보세요.
                </p>
            </div>

            {/* 네비게이션 카드 */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 18, marginBottom: 60 }}>
                <a href="/region" style={{ textDecoration: "none" }}>
                    <div className="washi-card nav-card" style={{
                        padding: 28, minHeight: 180,
                        background: "linear-gradient(135deg, #b6332b 0%, #8a1f1a 100%)",
                        color: "var(--washi)", cursor: "pointer",
                    }}>
                        <div style={{ fontSize: 36, marginBottom: 12 }}>⛩</div>
                        <div style={{ fontFamily: "Shippori Mincho, serif", fontSize: 13, letterSpacing: "0.4em", opacity: 0.75, marginBottom: 8 }}>地域から探す</div>
                        <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 10 }}>지역별로 찾기</div>
                        <p style={{ fontSize: 13, lineHeight: 1.6, opacity: 0.85 }}>아이치현 시정촌의 마츠리를 시별로 모아 보세요.</p>
                        <div style={{ marginTop: 16, fontSize: 13, fontWeight: 600 }}>둘러보기 →</div>
                    </div>
                </a>
                <a href="/date" style={{ textDecoration: "none" }}>
                    <div className="washi-card nav-card" style={{
                        padding: 28, minHeight: 180,
                        background: "linear-gradient(135deg, #faf3e1 0%, #ebe0c8 100%)",
                        cursor: "pointer",
                    }}>
                        <div style={{ fontSize: 36, marginBottom: 12 }}>📅</div>
                        <div style={{ fontFamily: "Shippori Mincho, serif", fontSize: 13, letterSpacing: "0.4em", opacity: 0.75, marginBottom: 8 }}>日付から探す</div>
                        <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 10 }}>날짜별로 찾기</div>
                        <p style={{ fontSize: 13, lineHeight: 1.6, opacity: 0.85 }}>여행 일정에 맞춰 그 날 열리는 마츠리를 골라보세요.</p>
                        <div style={{ marginTop: 16, fontSize: 13, fontWeight: 600 }}>둘러보기 →</div>
                    </div>
                </a>
            </div>

            {/* 예정된 마츠리 */}
            {upcoming.length > 0 && (
                <>
                    <div style={{ marginBottom: 28 }}>
                        <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
                            <h2 style={{ fontSize: 32, fontWeight: 700 }}>곧 열리는 마츠리</h2>
                            <div style={{ fontFamily: "Shippori Mincho, serif", fontSize: 16, color: "var(--red-deep)", letterSpacing: "0.2em" }}>
                                開催予定
                            </div>
                        </div>
                        <div style={{ width: 80, marginTop: 6 }}><span className="brush-line" /></div>
                    </div>
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                        gap: 20,
                    }}>
                        {upcoming.slice(0, 8)
                            .filter(m => m.shortDescKo && m.shortDescKo.trim() !== "")
                            .map((m) => (
                            <MatsuriCard key={m.id} matsuri={m} onClick={() => setOpenMatsuri(m)} />
                        ))}
                    </div>
                </>
            )}

            {/* 모달 */}
            {openMatsuri && (
                <MatsuriModal matsuri={openMatsuri} onClose={() => setOpenMatsuri(null)} />
            )}
        </div>
    );
}