const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export interface Matsuri {
  id: number;
  detailId: number;
  sourceUrl: string;
  nameKo: string;
  cityKo: string;
  isEnded: number;
  imageUrls: string;
  shortDescKo: string;
  longDescKo: string;
  eventDatesKo: string;
  eventTimeKo: string;
  venueKo: string;
  addressKo: string;
  contact: string;
  accessTrainKo: string;
  accessCarKo: string;
  relatedUrl: string;
  startDate: string;
  endDate: string;
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

// 진행 중인 마츠리
export async function fetchOngoing(): Promise<Matsuri[]> {
  const res = await fetch(`${API_BASE}/api/matsuris/ongoing`);
  if (!res.ok) throw new Error("Failed to fetch ongoing matsuris");
  return res.json();
}

// 예정된 마츠리
export async function fetchUpcoming(): Promise<Matsuri[]> {
  const res = await fetch(`${API_BASE}/api/matsuris/upcoming`);
  if (!res.ok) throw new Error("Failed to fetch upcoming matsuris");
  return res.json();
}

// 도시 목록
export async function fetchCities(): Promise<string[]> {
    const res = await fetch(`${API_BASE}/api/matsuris/cities`);
    if (!res.ok) throw new Error("Failed to fetch cities");
    return res.json();
}

// 도시별 마츠리
export async function fetchByCity(city: string): Promise<Matsuri[]> {
    const res = await fetch(`${API_BASE}/api/matsuris/city/${encodeURIComponent(city)}`);
    if (!res.ok) throw new Error("Failed to fetch by city");
    return res.json();
}

// 날짜별 마츠리
export async function fetchByDate(date: string): Promise<Matsuri[]> {
    const res = await fetch(`${API_BASE}/api/matsuris/date/${date}`);
    if (!res.ok) throw new Error("Failed to fetch by date");
    return res.json();
}