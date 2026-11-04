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
          <span className="kicker">The project</span>
          <h2>
            Fan-led analysis, <span className="accent">for fans</span>.
          </h2>
        </div>
        <p>
          We were tired of two extremes: shallow notes from a scores app,
          or pundit panels full of jargon that only speak to people
          who already know the game. We wanted real depth, explained without
          talking down to anyone.
        </p>
        <p>
          <strong>Copero Analysis</strong> began with a personal goal:
          to follow Grêmio with the same tactical rigor as always, while
          keeping the language of the stands. It grew into a project: serious analysis
          told by someone beside you, not above you.
        </p>
      </div>
      <div className="page-section the-team">
        <div>
          <span className="kicker">The team</span>
          <h2>Meet the team</h2>
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
          <span className="kicker">Get in touch</span>
          <h2 id="contato-heading">Copero on social media</h2>
        </div>
        <p>Follow Copero for more match analysis.</p>
        <SocialLinks />
      </section>
    </main>
  );
}
