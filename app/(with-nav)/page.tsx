import { LandingPage } from "../../features/landing/landing-page";
import { fetchProximaPartida } from "../../features/landing/proxima-partida-api";

export const metadata = { alternates: { canonical: "/" } };
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const proximaPartida = await safeFetchProximaPartida();

  return <LandingPage proximaPartida={proximaPartida} />;
}

async function safeFetchProximaPartida() {
  try {
    return await fetchProximaPartida();
  } catch {
    return null;
  }
}
