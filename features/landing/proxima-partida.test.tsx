import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { ProximaPartidaCard } from "./proxima-partida";
import type { ProximaPartida } from "./proxima-partida-api";

test("não renderiza card quando não há próxima partida", () => {
  render(<ProximaPartidaCard partida={null} />);

  expect(screen.queryByTestId("next-match-card")).not.toBeInTheDocument();
});

test("mostra confronto em casa e link quando há Preleção publicada", () => {
  render(<ProximaPartidaCard partida={partida({ home: true, teamTalkSlug: "bahia" })} />);

  const card = screen.getByTestId("next-match-card");
  const scoreCard = card.querySelector(".score-card");
  expect(card).toHaveTextContent("Brasileirão");
  expect(card).toHaveTextContent("Grêmio");
  expect(card).toHaveTextContent("Bahia");
  expect(scoreCard).toHaveClass("score-card--with-team-talk");
  expect(screen.getByTestId("next-match-home-team").previousElementSibling).toHaveAttribute("src", "/gremio.svg");
  expect(screen.queryByRole("heading", { name: "Grêmio x Bahia" })).not.toBeInTheDocument();
  expect(screen.queryByText("Casa")).not.toBeInTheDocument();
  expect(screen.queryByText("Fora")).not.toBeInTheDocument();
  expect(screen.getByText("08/08 · 21:30 · Fase única · Rodada 15")).toBeInTheDocument();
  expect(screen.getByText("Preleção no ar")).toBeInTheDocument();
  expect(screen.getByText("Arena do Grêmio")).toBeInTheDocument();
  expect(screen.getByText("Porto Alegre, Brasil")).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Ler a Preleção" })).toHaveAttribute("href", "/prelecao/bahia");
});

test("mostra confronto fora e omite link sem Preleção publicada", () => {
  render(<ProximaPartidaCard partida={partida({ home: false })} />);

  const card = screen.getByTestId("next-match-card");
  const teams = Array.from(document.querySelectorAll(".team-row span:last-child")).map((node) => node.textContent);
  expect(teams).toEqual(["Bahia", "Grêmio"]);
  expect(card.querySelector(".score-card")).not.toHaveClass("score-card--with-team-talk");
  expect(card.querySelector(".score-card-actions")).not.toBeInTheDocument();
  expect(screen.getByTestId("next-match-home-team").previousElementSibling).toHaveAttribute("src", "/gremio.svg");
  expect(screen.queryByRole("heading", { name: "Bahia x Grêmio" })).not.toBeInTheDocument();
  expect(screen.queryByRole("link", { name: "Ler a Preleção" })).not.toBeInTheDocument();
});

test("degrada escudo e cidade quando o calendário público não trouxe enriquecimento", () => {
  render(<ProximaPartidaCard partida={partida({ home: true, enriched: false })} />);

  expect(screen.getByText("B")).toHaveClass("team-crest--away");
  expect(screen.queryByText("Porto Alegre, Brasil")).not.toBeInTheDocument();
});

function partida(options: { home: boolean; teamTalkSlug?: string; enriched?: boolean }): ProximaPartida {
  const enriched = options.enriched ?? true;
  return {
    match: { season: "2026", competition: "Brasileirão", phase: "Fase única", round: "15", opponent: "Bahia" },
    home: options.home,
    opponentCrestUrl: enriched ? "https://img.example/bahia.svg" : undefined,
    kickoffUtc: "2026-08-09T00:30:00Z",
    stadium: "Arena do Grêmio",
    stadiumCity: enriched ? "Porto Alegre" : undefined,
    stadiumCountry: enriched ? "Brasil" : undefined,
    teamTalkSlug: options.teamTalkSlug,
  };
}
