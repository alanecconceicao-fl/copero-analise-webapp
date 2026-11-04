import type { PrelecaoLineupPlayer } from "./prelecao-api";

export type PitchCoordinates = {
  x: number | null;
  y: number | null;
};

export type PitchPosition = {
  top: number;
  left: number;
};

export type LineupGroups = {
  list: PrelecaoLineupPlayer[];
  positioned: PrelecaoLineupPlayer[];
  missingPosition: PrelecaoLineupPlayer[];
};

export function pitchPosition(coordinates: PitchCoordinates): PitchPosition | null {
  if (coordinates.x === null || coordinates.y === null) {
    return null;
  }

  const rawTop = 100 - clampPercent(coordinates.x);
  const rawLeft = 100 - clampPercent(coordinates.y);

  return {
    top: clampDisplayPercent(rawTop, 6, 91),
    left: clampDisplayPercent(rawLeft, 9, 91),
  };
}

export function visibleNumber(number: number | null): string | null {
  if (number === null || number <= 0) {
    return null;
  }
  return String(number);
}

export function lineupGroups(players: PrelecaoLineupPlayer[]): LineupGroups {
  const positioned: Array<PrelecaoLineupPlayer & { x: number; y: number }> = [];
  const missingPosition: PrelecaoLineupPlayer[] = [];

  for (const player of players) {
    if (hasPosition(player)) {
      positioned.push(player);
    } else {
      missingPosition.push(player);
    }
  }

  return {
    list: players,
    positioned: positioned.toSorted((a, b) => a.x - b.x),
    missingPosition,
  };
}

function hasPosition(player: PrelecaoLineupPlayer): player is PrelecaoLineupPlayer & { x: number; y: number } {
  return pitchPosition(player) !== null;
}

function clampPercent(value: number): number {
  return Math.min(100, Math.max(0, value));
}

function clampDisplayPercent(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
