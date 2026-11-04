// The carousel's first item links here (AC 4) — a page that goes deeper on
// what the Copero is. Copy is a DRAFT per _docs/guia-voz.md (author's HITL).
import { AdSenseSlot } from "../../shared/adsense";
import { Logo } from "../../shared/logo";

export function OQueEPage() {
  return (
    <main className="page" data-testid="o-que-e">
      <header className="page-header page-header--centered">
        <Logo size="md" />
      </header>
      <div className="stripe-divider" />
      <div className="hero-card">
        <span className="kicker">O que é</span>
        <h1>Copero Análise</h1>
        <p>Em breve, no teu bolso: a análise do Grêmio que tava faltando.</p>
      </div>
      <div className="page-section the-story">
        <p>
          O <strong>Copero Análise</strong> é um app de análise do Grêmio:
          por dentro, dados e leitura técnica de verdade; por fora, contado
          na conversa que rola de igual pra igual na arquibancada. Sem
          clickbait, sem chute de mesa-redonda.
        </p>
        <p>
          Toda análise é feita com critérios técnicos reais: transição ofensiva,
          transição defensiva, movimentação com bola, movimentação sem bola,
          bola parada, jogo apoiado, pressão ao portador da bola, e etc.
          Mas isso fica nos bastidores: o jargão não vai pro texto.
          O que chega pra ti é o jogo explicado, tipo aquela avenida que sobrou
          na ponta, ou a velocidade da gurizada pelas pontas.
        </p>
      </div>
      <div className="callout">
        <span className="kicker">A ideia</span>
        <h2>Cada jogo do Grêmio merece uma análise à altura.</h2>
        <p>E ela tem que caber no bolso do torcedor.</p>
      </div>
      <div className="page-section the-features">
        <h2>Os Tipos de Análise</h2>
        <ul className="feature-list">
          <li>
            <h3>Preleção</h3>
            <p>
              1–2 dias antes do jogo: como o adversário costuma jogar e os
              dois pontos por onde a partida tende a se decidir.
            </p>
          </li>
          <li>
            <h3>Jornada do Copero</h3>
            <p>
              No dia da bola rolar: escalação confirmada, o intervalo com o
              melhor do 1.º tempo, e a resenha quente do pós-jogo.
            </p>
          </li>
        </ul>
      </div>
      <AdSenseSlot />
    </main>
  );
}
