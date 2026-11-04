import { lineupGroups, pitchPosition, visibleNumber } from "./pitch-layout";
import type { PrelecaoLineupPlayer } from "./match-details-api";

type PitchProps = {
  players: PrelecaoLineupPlayer[];
  primaryColor: string;
  secondaryColor: string;
  opponent: string;
};

export function Pitch({ players, primaryColor, secondaryColor, opponent }: PitchProps) {
  const groups = lineupGroups(players);

  return (
    <div className="pitch" role="img" aria-label={`Vertical pitch showing ${opponent}’s probable starters`}>
      <svg className="pitch-lines" viewBox="0 0 68 105" aria-hidden="true" focusable="false">
        <rect x="1" y="1" width="66" height="103" rx="1" />
        <line x1="1" y1="52.5" x2="67" y2="52.5" />
        <circle cx="34" cy="52.5" r="9.15" />
        <circle cx="34" cy="52.5" r="0.8" />
        <rect x="13.84" y="1" width="40.32" height="16.5" />
        <rect x="24.84" y="1" width="18.32" height="5.5" />
        <circle cx="34" cy="11" r="0.7" />
        <rect x="13.84" y="87.5" width="40.32" height="16.5" />
        <rect x="24.84" y="98.5" width="18.32" height="5.5" />
        <circle cx="34" cy="94" r="0.7" />
      </svg>
      {groups.positioned.map((player) => {
        const position = pitchPosition(player)!;
        return (
          <div
            className="pitch-player"
            data-testid={`pitch-player-${player.name}`}
            key={player.name}
            style={{ top: `${position.top}%`, left: `${position.left}%` }}
          >
            <span
              className="pitch-token"
              data-testid={`pitch-token-${player.name}`}
              style={{
                background: primaryColor,
                color: secondaryColor,
                borderColor: secondaryColor,
              }}
            >
              {visibleNumber(player.number)}
            </span>
            <span className="pitch-player-name">{player.name}</span>
          </div>
        );
      })}
    </div>
  );
}
