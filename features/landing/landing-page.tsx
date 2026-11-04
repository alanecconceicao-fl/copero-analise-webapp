// The landing that sells the app (AC 3–5, 8): carousel on top, selling text
// below, AdSense slot at the end.
import { AdSenseSlot } from "../../shared/adsense";
import { SocialLinks } from "../../shared/social-links";
import { Logo } from "../../shared/logo";
import { Carousel } from "./carousel";
import { carouselItems, sellingText } from "./content";
import { ProximaPartidaCard } from "./proxima-partida";
import type { ProximaPartida } from "./proxima-partida-api";

export function LandingPage({ proximaPartida = null }: { proximaPartida?: ProximaPartida | null }) {
  return (
    <main className="page">
      <header className="page-header page-header--centered">
        <Logo size="md" />
      </header>
      <div className="stripe-divider" />
      <Carousel items={carouselItems} />
      <ProximaPartidaCard partida={proximaPartida} />
      <section className="page-section selling-section">
        <h2>
          A arquibancada vai parar no <span className="accent">app</span>.
        </h2>
        <p data-testid="selling-text">{sellingText}</p>
      </section>
      <AdSenseSlot />
      <SocialLinks />
    </main>
  );
}
