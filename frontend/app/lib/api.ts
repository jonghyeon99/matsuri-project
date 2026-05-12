const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export interface Matsuri {
  id: number;
  detailId: number;
  sourceUrl: string;
  nameJp: string;
  nameKo: string;
  furigana: string;
  cityJp: string;
  cityKo: string;
  isEnded: number;
  imageUrls: string;
  shortDescJp: string;
  shortDescKo: string;
  longDescJp: string;
  longDescKo: string;
  eventDatesJp: string;
  eventDatesKo: string;
  eventTimeJp: string;
  eventTimeKo: string;
  venueJp: string;
  venueKo: string;
  addressJp: string;
  addressKo: string;
  contact: string;
  accessTrainJp: string;
  accessTrainKo: string;
  accessCarJp: string;
  accessCarKo: string;
  relatedUrl: string;
  crawledAt: string;
}

// 전체 마츠리 목록
export async function fetchMatsuris(): Promise<Matsuri[]> {
  const res = await fetch(`${API_BASE}/api/matsuris`);
  if (!res.ok) throw new Error("Failed to fetch matsuris");
  return res.json();
}

// 단일 마츠리 상세
export async function fetchMatsuri(id: number): Promise<Matsuri> {
  const res = await fetch(`${API_BASE}/api/matsuris/${id}`);
  if (!res.ok) throw new Error("Failed to fetch matsuri");
  return res.json();
}