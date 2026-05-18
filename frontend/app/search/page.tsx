import { Suspense } from "react";
import SearchClient from "./SearchClient";

export default function SearchPage() {
    return (
        <Suspense fallback={<div style={{ textAlign: "center", padding: 40 }}>불러오는 중...</div>}>
            <SearchClient />
        </Suspense>
    );
}