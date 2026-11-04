import { describe, expect, test } from "vitest";
import { lineupGroups, pitchPosition, visibleNumber } from "./pitch-layout";
import type { PrelecaoLineupPlayer } from "./match-details-api";

describe("pitchPosition", () => {
  test("inverte profundidade: defesa embaixo e ataque em cima", () => {
    expect(pitchPosition({ x: 10, y: 50 })).toEqual({ top: 90, left: 50 });
    expect(pitchPosition({ x: 90, y: 50 })).toEqual({ top: 10, left: 50 });
  });

  test("orienta a largura pela perspectiva de ataque da equipe", () => {
    const renanLodi = pitchPosition({ x: 53.84879625750575, y: 84.1669652981425 });
    const natanael = pitchPosition({ x: 43.59593036182205, y: 19.1521103818931 });

    expect(renanLodi?.left).toBeCloseTo(15.833034701857495);
    expect(natanael?.left).toBeCloseTo(80.8478896181069);
    expect(renanLodi!.left).toBeLessThan(natanael!.left);
  });

  test("não posiciona quando qualquer coordenada está nula", () => {
    expect(pitchPosition({ x: null, y: 50 })).toBeNull();
    expect(pitchPosition({ x: 50, y: null })).toBeNull();
    expect(pitchPosition({ x: null, y: null })).toBeNull();
  });

  test("limita coordenadas fora de 0 a 100", () => {
    expect(pitchPosition({ x: 130, y: -10 })).toEqual({ top: 6, left: 91 });
    expect(pitchPosition({ x: -20, y: 150 })).toEqual({ top: 91, left: 9 });
  });

  test("mantém tokens e nomes dentro das bordas do campo", () => {
    expect(pitchPosition({ x: 100, y: 0 })).toEqual({ top: 6, left: 91 });
    expect(pitchPosition({ x: 0, y: 100 })).toEqual({ top: 91, left: 9 });
  });
});

test("número só aparece quando é positivo", () => {
  expect(visibleNumber(7)).toBe("7");
  expect(visibleNumber(null)).toBeNull();
  expect(visibleNumber(0)).toBeNull();
  expect(visibleNumber(-2)).toBeNull();
});

test("particiona titulares posicionáveis e sem coordenada preservando a lista completa", () => {
  const players: PrelecaoLineupPlayer[] = [
    player("Atacante", 90, 50),
    player("Sem X", null, 20),
    player("Defensor", 10, 40),
    player("Sem Y", 35, null),
  ];

  expect(lineupGroups(players)).toEqual({
    list: players,
    positioned: [players[2], players[0]],
    missingPosition: [players[1], players[3]],
  });
});

function player(name: string, x: number | null, y: number | null): PrelecaoLineupPlayer {
  return {
    name,
    number: null,
    position: "Titular",
    x,
    y,
  };
}
