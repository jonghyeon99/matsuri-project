"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/",       ko: "메인",   jp: "祭" },
  { href: "/region", ko: "지역별", jp: "地域" },
  { href: "/date",   ko: "날짜별", jp: "日付" },
];

export default function Header() {
  const pathname = usePathname();

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
        display: "flex", alignItems: "center", justifyContent: "space-between",
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
                <div style={{ fontFamily: "Shippori Mincho, serif", fontSize: 13, opacity: 0.6 }}>{t.jp}</div>
                <div style={{ fontSize: 14, fontWeight: 600, marginTop: 1 }}>{t.ko}</div>
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

        <button className="btn ghost" style={{ fontSize: 12, padding: "8px 12px" }}>
          🔍 검색
        </button>
      </div>
    </header>
  );
}