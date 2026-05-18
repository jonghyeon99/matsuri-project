"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const tabs = [
    { href: "/",       ko: "메인",   jp: "祭" },
    { href: "/region", ko: "지역별", jp: "地域" },
    { href: "/date",   ko: "날짜별", jp: "日付" },
];

export default function Header() {
    const pathname = usePathname();
    const router = useRouter();
    const [searchOpen, setSearchOpen] = useState(false);
    const [keyword, setKeyword] = useState("");

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!keyword.trim()) return;
        router.push(`/search?keyword=${encodeURIComponent(keyword.trim())}`);
        setSearchOpen(false);
        setKeyword("");
    };

    return (
        <header style={{
            position: "sticky", top: 0, zIndex: 50,
            background: "rgba(243, 234, 216, 0.92)",
            backdropFilter: "blur(8px)",
            borderBottom: "1px solid var(--washi-edge)",
        }}>
            <div style={{
                maxWidth: 1280, margin: "0 auto",
                padding: "14px 24px",
                display: "grid",
                gridTemplateColumns: "1fr auto 1fr",
                alignItems: "center",
                gap: 16,
            }}>
                {/* 로고 */}
                <Link href="/" style={{ display: "flex", alignItems: "center", gap: 14, textDecoration: "none", color: "inherit" }}>
                    <div className="seal round" style={{ width: 46, height: 46, fontSize: 22 }}>祭</div>
                    <div>
                        <div style={{ fontFamily: "Shippori Mincho, serif", fontSize: 20, fontWeight: 700, letterSpacing: "0.08em", lineHeight: 1 }}>
                            愛知<span style={{ color: "var(--red)" }}>祭</span>
                        </div>
                        <div style={{ fontSize: 11, color: "var(--ink-faint)", marginTop: 4, letterSpacing: "0.1em" }}>
                            아이치 마츠리 가이드
                        </div>
                    </div>
                </Link>

                {/* 탭 네비게이션 */}
                <nav style={{ display: "flex", gap: 6 }}>
                    {tabs.map(t => {
                        const active = pathname === t.href;
                        return (
                            <Link
                                key={t.href}
                                href={t.href}
                                style={{
                                    textDecoration: "none",
                                    padding: "8px 16px",
                                    borderRadius: 2,
                                    position: "relative",
                                    color: active ? "var(--red-deep)" : "var(--sumi)",
                                    display: "block",
                                }}
                            >
                                <div style={{ fontFamily: "Shippori Mincho, serif", fontSize: 13, opacity: 0.6, textAlign: "center" }}>{t.jp}</div>
                                <div style={{ fontSize: 14, fontWeight: 600, marginTop: 1, textAlign: "center" }}>{t.ko}</div>
                                {active && (
                                    <div style={{
                                        position: "absolute", left: 16, right: 16, bottom: -1, height: 3,
                                        background: "var(--red)",
                                        borderRadius: "50% 50% 0 0",
                                    }} />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* 검색 버튼 */}
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <button
                        className="btn ghost"
                        onClick={() => setSearchOpen(v => !v)}
                        style={{ fontSize: 13, padding: "8px 14px", display: "flex", alignItems: "center", gap: 6 }}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8"/>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                        </svg>
                        검색
                    </button>
                </div>
            </div>

            {/* 검색창 */}
            {searchOpen && (
                <div style={{
                    borderTop: "1px solid var(--washi-edge)",
                    background: "rgba(243, 234, 216, 0.98)",
                    padding: "16px 24px",
                }}>
                    <form
                        onSubmit={handleSearch}
                        style={{
                            maxWidth: 600, margin: "0 auto",
                            display: "flex", gap: 10,
                        }}
                    >
                        <input
                            autoFocus
                            type="text"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            placeholder="마츠리 이름, 지역, 키워드로 검색..."
                            style={{
                                flex: 1,
                                border: "1px solid var(--washi-edge)",
                                background: "var(--washi)",
                                padding: "10px 16px",
                                fontSize: 14,
                                fontFamily: "inherit",
                                borderRadius: 2,
                                color: "var(--sumi)",
                                outline: "none",
                            }}
                        />
                        <button className="btn primary" type="submit" style={{ padding: "10px 24px" }}>
                            검색
                        </button>
                        <button
                            type="button"
                            className="btn"
                            onClick={() => setSearchOpen(false)}
                            style={{ padding: "10px 16px" }}
                        >
                            취소
                        </button>
                    </form>
                </div>
            )}
        </header>
    );
}