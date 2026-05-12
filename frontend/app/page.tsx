import { fetchMatsuris } from "./lib/api";
import MatsuriCard from "./components/MatsuriCard";

export default async function HomePage() {
  const matsuris = await fetchMatsuris();

  // 종료되지 않은 마츠리만 필터
  const active = matsuris.filter((m) => m.isEnded === 0);

  return (
    <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px 80px" }}>

      {/* 헤더 타이틀 */}
      <div style={{ marginBottom: 36 }}>
        <div style={{
          fontFamily: "Shippori Mincho, serif",
          fontSize: 13, color: "var(--red-deep)",
          letterSpacing: "0.4em", marginBottom: 6
        }}>
          開催中の祭 ・ 開催予定の祭
        </div>
        <h1 style={{ fontSize: 36, fontWeight: 700, letterSpacing: "-0.01em" }}>
          아이치현의 <span style={{ color: "var(--red)" }}>마츠리</span> 정보
        </h1>
        <p style={{ marginTop: 10, fontSize: 14, color: "var(--ink-faint)" }}>
          총 <strong>{active.length}</strong>개의 마츠리 정보를 찾았어요.
        </p>
      </div>

      {/* 카드 그리드 */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
        gap: 20,
      }}>
        {active.map((m) => (
          <MatsuriCard key={m.id} matsuri={m} />
        ))}
      </div>
    </div>
  );
}