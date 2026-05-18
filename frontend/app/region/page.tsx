import { fetchCities } from "../lib/api";
import RegionClient from "./RegionClient";

export default async function RegionPage() {
    const cities = await fetchCities();
    return <RegionClient cities={cities} />;
}