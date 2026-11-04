// AC 6: what the Copero is + the people, each with a short intro. Copy DRAFT
// (guia-voz; author's HITL) — the team roster especially awaits his words.
import { AdSenseSlot } from "../../shared/adsense";
import { Logo } from "../../shared/logo";
import { SocialLinks } from "../../shared/social-links";
import { getTeam } from "./team-repository";

export async function SobreNosPage() {
  const team = await getTeam();

  return (
    <main className="page" data-testid="sobre-nos">
      <header className="page-header page-header--centered">
        <Logo size="md" />
      </header>
      <div className="stripe-divider" />
      <div className="page-section the-project">
        <div>
          <span className="kicker">O projeto</span>
          <h2>
            Análise de torcedor, <span className="accent">pra torcedor</span>.
          </h2>
        </div>
        <p>
          A gente cansou de dois extremos: ou é nota rasa de aplicativo de
          placar, ou é mesa-redonda cheia de termo técnico que só fala pra
          quem já entende. Faltava profundidade de verdade, contada sem
          soar de cima pra baixo.
        </p>
        <p>
          O <strong>Copero Análise</strong> nasceu de uma vontade pessoal:
          acompanhar o Grêmio com a mesma seriedade tática de
          sempre, sem perder a língua da arquibancada. Virou projeto: análise
          séria, contada por quem tá do teu lado, não de cima.
        </p>
      </div>
      <div className="page-section the-team">
        <div>
          <span className="kicker">O time</span>
          <h2>Quem tá no projeto</h2>
        </div>
        <ul className="team-list" data-testid="pessoas">
          {team.map((person) => (
            <li key={person.initials} className="team-card">
              <span className="avatar">{person.initials}</span>
              <div>
                <h3>{person.name}</h3>
                <span className="role-tag">{person.role}</span>
                <p>{person.bio}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <AdSenseSlot />
      <section className="page-section contact-section" aria-labelledby="contato-heading">
        <div>
          <span className="kicker">Fala com a gente</span>
          <h2 id="contato-heading">Copero nas redes</h2>
        </div>
        <p>Segue o Copero e acompanha as próximas leituras do jogo.</p>
        <SocialLinks />
      </section>
    </main>
  );
}
