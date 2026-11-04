import { formatKickoff } from "./format-kickoff";
import { CalendarIcon, PinIcon, StadiumIcon } from "../../shared/match-icons";
import { paragraphs } from "./narration";
import { lineupGroups } from "./pitch-layout";
import { Pitch } from "./pitch";
import type { PublicPrelecao, PrelecaoSection } from "./prelecao-api";

type PrelecaoPageProps = {
  prelecao: PublicPrelecao;
};

export function PrelecaoPage({ prelecao }: PrelecaoPageProps) {
  const lineupSection = prelecao.sections.find((section) => section.id === "likely-lineup");
  const narrativeSections = prelecao.sections.filter((section) => section.id !== "likely-lineup");
  const groups = lineupGroups(prelecao.lineup.players);

  return (
    <main className="page prelecao-page">
      <header className="prelecao-header">
        <span className="kicker">Preleção</span>
        <h1>{prelecao.match.opponent}</h1>
        <PrelecaoMeta prelecao={prelecao} />
      </header>

      {lineupSection ? (
        <section className="page-section prelecao-lineup">
          <h2>{lineupSection.title}</h2>
          {paragraphs(lineupSection.body).map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <Pitch
            players={groups.positioned}
            primaryColor={prelecao.lineup.primaryColor}
            secondaryColor={prelecao.lineup.secondaryColor}
            opponent={prelecao.match.opponent}
          />
          {groups.missingPosition.length > 0 ? (
            <p className="prelecao-missing-position">
              Sem posição média em campo: {groups.missingPosition.map((player) => player.name).join(", ")}
            </p>
          ) : null}
          <Incidences section={lineupSection} />
        </section>
      ) : null}

      {narrativeSections.map((section) => (
        <PrelecaoSectionBlock key={section.id} section={section} />
      ))}
    </main>
  );
}

function PrelecaoSectionBlock({ section }: { section: PrelecaoSection }) {
  return (
    <section className="page-section prelecao-section">
      <h2>{section.title}</h2>
      {paragraphs(section.body).map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
      <Incidences section={section} />
    </section>
  );
}

function Incidences({ section }: { section: PrelecaoSection }) {
  if (!section.incidences || section.incidences.length === 0) {
    return null;
  }
  return (
    <details className="prelecao-details">
      <summary>De onde vem essa leitura</summary>
      <ul>
        {section.incidences.map((incidence) => (
          <li key={incidence}>{incidence}</li>
        ))}
      </ul>
    </details>
  );
}

function PrelecaoMeta({ prelecao }: { prelecao: PublicPrelecao }) {
  const place = [prelecao.stadiumCity, prelecao.stadiumCountry].filter(Boolean).join(", ");
  return (
    <div className="prelecao-meta-stack">
      <p className="prelecao-competition">
        {prelecao.match.competition} · {prelecao.match.phase} · Rodada {prelecao.match.round}
      </p>
      <dl className="match-meta prelecao-meta">
      <div>
        <dt><CalendarIcon /></dt>
        <dd>{formatKickoff(prelecao.kickoffUtc)}</dd>
      </div>
      <div>
        <dt><StadiumIcon /></dt>
        <dd>{prelecao.stadium}</dd>
      </div>
      {place ? (
        <div>
          <dt><PinIcon /></dt>
          <dd>{place}</dd>
        </div>
      ) : null}
      </dl>
    </div>
  );
}
