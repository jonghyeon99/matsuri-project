import { fetchOngoing, fetchUpcoming } from "./lib/api";
import HomeClient from "./HomeClient";

export default async function HomePage() {
    const [ongoing, upcoming] = await Promise.all([
        fetchOngoing(),
        fetchUpcoming(),
    ]);
    return <HomeClient ongoing={ongoing} upcoming={upcoming} />;
}