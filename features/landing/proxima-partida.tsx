import Link from "next/link";
import { PinIcon, StadiumIcon } from "../../shared/match-icons";
import type { ProximaPartida } from "./proxima-partida-api";

type ProximaPartidaCardProps = {
  partida: ProximaPartida | null;
};

const GremioCrestUrl = "/team.svg";

export function ProximaPartidaCard({ partida }: ProximaPartidaCardProps) {
  if (!partida) {
    return null;
  }
  const homeTeam = partida.home
    ? { name: "Grêmio", crestUrl: GremioCrestUrl, side: "home" as const }
    : { name: partida.match.opponent, crestUrl: partida.opponentCrestUrl, side: "away" as const };
  const awayTeam = partida.home
    ? { name: partida.match.opponent, crestUrl: partida.opponentCrestUrl, side: "away" as const }
    : { name: "Grêmio", crestUrl: GremioCrestUrl, side: "home" as const };

  return (
    <section className="page-section next-match" data-testid="next-match-card">
      <div className="next-match-head">
        <span className="kicker">Próximo jogo</span>
        {partida.teamTalkSlug ? <span className="next-match-tag">Preleção no ar</span> : null}
      </div>
      <div className={`score-card${partida.teamTalkSlug ? " score-card--with-team-talk" : ""}`}>
        <div className="score-card-content">
          <p className="score-card-competition">{partida.match.competition}</p>
          <div className="score-card-teams">
            <TeamRow {...homeTeam} />
            <TeamRow {...awayTeam} />
          </div>
          <p className="score-card-fixture">
            {shortKickoffDate(partida.kickoffUtc)} · {shortKickoffTime(partida.kickoffUtc)} · {partida.match.phase} · Rodada {partida.match.round}
          </p>
          <MatchMeta partida={partida} />
        </div>
        {partida.teamTalkSlug ? (
          <div className="score-card-actions">
            <Link className="score-card-link score-card-link--primary" href={`/prelecao/${partida.teamTalkSlug}`}>Ler a Preleção</Link>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function MatchMeta({ partida }: { partida: ProximaPartida }) {
  const place = [partida.stadiumCity, partida.stadiumCountry].filter(Boolean).join(", ");
  return (
    <dl className="match-meta score-card-meta">
      <div>
        <dt><StadiumIcon /></dt>
        <dd>{partida.stadium}</dd>
      </div>
      {place ? (
        <div>
          <dt><PinIcon /></dt>
          <dd>{place}</dd>
        </div>
      ) : null}
    </dl>
  );
}

function TeamRow({ name, crestUrl, side }: { name: string; crestUrl?: string; side: "home" | "away" }) {
  return (
    <div className="team-row">
      {crestUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img className="team-crest" src={crestUrl} alt="" aria-hidden="true" />
      ) : (
        <span className={`team-crest team-crest--${side}`} aria-hidden="true">{name.charAt(0)}</span>
      )}
      <span data-testid={`next-match-${side}-team`}>{name}</span>
    </div>
  );
}

const SaoPauloTimeZone = "America/Sao_Paulo";

function shortKickoffDate(kickoffUTC: string): string {
  const date = new Date(kickoffUTC);
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    timeZone: SaoPauloTimeZone,
  }).format(date);
}

function shortKickoffTime(kickoffUTC: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: SaoPauloTimeZone,
  }).format(new Date(kickoffUTC));
}
