export default function Footer() {
    return (
        <footer style={{
            borderTop: "1px solid var(--washi-edge)",
            marginTop: 60,
            padding: "32px 24px 60px",
            background: "linear-gradient(180deg, transparent, rgba(168, 127, 62, 0.05))",
            position: "relative",
            zIndex: 1,
        }}>
            <div style={{
                maxWidth: 1280, margin: "0 auto",
                display: "flex", justifyContent: "space-between",
                alignItems: "center", flexWrap: "wrap", gap: 20,
            }}>
                {/* 로고 */}
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div className="seal round" style={{ width: 40, height: 40, fontSize: 18 }}>祭</div>
                    <div>
                        <div style={{ fontFamily: "Shippori Mincho, serif", fontSize: 14, fontWeight: 700, letterSpacing: "0.1em" }}>
                            愛知祭 ・ 아이치 마츠리 가이드
                        </div>
                        <div style={{ fontSize: 11, color: "var(--ink-faint)", marginTop: 4 }}>
                            아이치현 마츠리 정보를 한국어로 — 데이터 출처: AichiNow
                        </div>
                    </div>
                </div>

                {/* 링크 */}
                <div style={{ display: "flex", gap: 14, fontSize: 12, color: "var(--ink-faint)" }}>
                    <a  href="https://aichinow.pref.aichi.jp"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "inherit" }}>
                        AichiNow
                    </a>
                </div>
            </div>
        </footer>
    );
}