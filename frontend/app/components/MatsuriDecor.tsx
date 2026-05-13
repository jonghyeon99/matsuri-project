"use client";

import { useState, useEffect } from "react";

export default function MatsuriDecor() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const lanternCount = 12;
    const lanterns = Array.from({ length: lanternCount }, (_, i) => ({
        x: (100 / lanternCount) * (i + 0.5),
        red: i % 2 === 0,
    }));

    const palette = ["#b6332b", "#d9a64a", "#2a3f5f", "#e87a52", "#4a7a4a"];
    const confetti = Array.from({ length: 14 }, (_, i) => ({
        left: `${(i * 73) % 100}%`,
        delay: `${(i * 0.7) % 10}s`,
        dur: `${10 + (i * 1.7) % 9}s`,
        color: palette[i % palette.length],
    }));

    return (
        <div className="matsuri-decor" aria-hidden="true">

            {/* 등불 가랜드 */}
            <div className="lantern-garland">
                <svg viewBox="0 0 1200 130" preserveAspectRatio="none">
                    <path
                        d="M -20 14 Q 600 60, 1220 14"
                        stroke="#1a1410"
                        strokeWidth="1.5"
                        fill="none"
                        opacity="0.7"
                    />
                    {lanterns.map((l, i) => {
                        const xN = (l.x - 50) / 50;
                        const dropY = 14 + (1 - xN * xN) * 26;
                        const cx = (l.x / 100) * 1200;
                        return (
                            <g key={i} transform={`translate(${cx}, ${dropY})`}>
                                <line x1="0" y1="0" x2="0" y2="14" stroke="#1a1410" strokeWidth="1" opacity="0.7" />
                                <g className="lantern-body">
                                    <rect x="-9" y="14" width="18" height="3" fill="#1a1410" />
                                    <ellipse
                                        cx="0" cy="38" rx="17" ry="22"
                                        fill={l.red ? "#b6332b" : "#e8b455"}
                                        stroke="#1a1410"
                                        strokeWidth="1"
                                    />
                                    <ellipse cx="0" cy="38" rx="17" ry="22" fill="none" stroke="#1a1410" strokeWidth="0.5" opacity="0.5" />
                                    <line x1="-16.5" y1="32" x2="16.5" y2="32" stroke="#1a1410" strokeWidth="0.5" opacity="0.45" />
                                    <line x1="-17" y1="38" x2="17" y2="38" stroke="#1a1410" strokeWidth="0.5" opacity="0.45" />
                                    <line x1="-16.5" y1="44" x2="16.5" y2="44" stroke="#1a1410" strokeWidth="0.5" opacity="0.45" />
                                    <text
                                        x="0" y="42"
                                        textAnchor="middle"
                                        fontFamily="Shippori Mincho, serif"
                                        fontSize="14"
                                        fontWeight="700"
                                        fill="#1a1410"
                                        opacity="0.85"
                                    >
                                        {l.red ? "祭" : "愛"}
                                    </text>
                                    <rect x="-9" y="59" width="18" height="3" fill="#1a1410" />
                                    <line x1="0" y1="62" x2="0" y2="68" stroke="#a87f3e" strokeWidth="1.2" />
                                    <circle cx="0" cy="70" r="2" fill="#a87f3e" />
                                </g>
                            </g>
                        );
                    })}
                </svg>
            </div>

            {/* 색종이 */}
            {confetti.map((c, i) => (
                <div
                    key={i}
                    className="confetti"
                    style={{
                        left: c.left,
                        top: 0,
                        animationDelay: c.delay,
                        animationDuration: c.dur,
                        background: c.color,
                    }}
                />
            ))}

            {/* 한자 워터마크 */}
            <div className="edge-kanji left">愛知県</div>
            <div className="edge-kanji right">祭り</div>

            {/* 코너 불꽃 */}
            <svg className="corner-spark tl" width="180" height="180" viewBox="0 0 180 180">
                <g stroke="#b6332b" strokeWidth="1.2" fill="none" opacity="0.18">
                    {Array.from({ length: 12 }).map((_, i) => {
                        const a = (i / 12) * Math.PI * 2;
                        const x2 = 90 + Math.cos(a) * 70;
                        const y2 = 90 + Math.sin(a) * 70;
                        return <line key={i} x1="90" y1="90" x2={x2} y2={y2} />;
                    })}
                    {Array.from({ length: 12 }).map((_, i) => {
                        const a = (i / 12) * Math.PI * 2;
                        const x2 = 90 + Math.cos(a) * 78;
                        const y2 = 90 + Math.sin(a) * 78;
                        return <circle key={i} cx={x2} cy={y2} r="2.5" fill="#d9a64a" stroke="none" />;
                    })}
                    <circle cx="90" cy="90" r="4" fill="#b6332b" stroke="none" />
                </g>
            </svg>
            <svg className="corner-spark br" width="180" height="180" viewBox="0 0 180 180">
                <g stroke="#2a3f5f" strokeWidth="1.2" fill="none" opacity="0.16">
                    {Array.from({ length: 10 }).map((_, i) => {
                        const a = (i / 10) * Math.PI * 2;
                        const x2 = 90 + Math.cos(a) * 60;
                        const y2 = 90 + Math.sin(a) * 60;
                        return <line key={i} x1="90" y1="90" x2={x2} y2={y2} />;
                    })}
                    {Array.from({ length: 10 }).map((_, i) => {
                        const a = (i / 10) * Math.PI * 2;
                        const x2 = 90 + Math.cos(a) * 68;
                        const y2 = 90 + Math.sin(a) * 68;
                        return <circle key={i} cx={x2} cy={y2} r="2.5" fill="#b6332b" stroke="none" />;
                    })}
                </g>
            </svg>
        </div>
    );
}