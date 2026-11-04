import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { ProximaPartidaCard } from "./proxima-partida";
import type { ProximaPartida } from "./proxima-partida-api";

test("does not render a card when there is no upcoming match", () => {
  render(<ProximaPartidaCard partida={null} />);

  expect(screen.queryByTestId("next-match-card")).not.toBeInTheDocument();
});

test("shows a home fixture and link when a match preview is published", () => {
  render(<ProximaPartidaCard partida={partida({ home: true, teamTalkSlug: "bahia" })} />);

  const card = screen.getByTestId("next-match-card");
  const scoreCard = card.querySelector(".score-card");
  expect(card).toHaveTextContent("Brazilian Championship");
  expect(card).toHaveTextContent("Grêmio");
  expect(card).toHaveTextContent("Bahia");
  expect(scoreCard).toHaveClass("score-card--with-team-talk");
  expect(screen.getByTestId("next-match-home-team").previousElementSibling).toHaveAttribute("src", "/gremio.svg");
  expect(screen.queryByRole("heading", { name: "Grêmio x Bahia" })).not.toBeInTheDocument();
  expect(screen.queryByText("Home")).not.toBeInTheDocument();
  expect(screen.queryByText("Away")).not.toBeInTheDocument();
  expect(screen.getByText("Aug 8 · 9:30 PM · Single Round · Round 15")).toBeInTheDocument();
  expect(screen.getByText("Match preview available")).toBeInTheDocument();
  expect(screen.getByText("Grêmio Arena")).toBeInTheDocument();
  expect(screen.getByText("Porto Alegre, Brazil")).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Read the match preview" })).toHaveAttribute("href", "/prelecao/bahia");
});

test("shows an away fixture and omits the link without a published match preview", () => {
  render(<ProximaPartidaCard partida={partida({ home: false })} />);

  const card = screen.getByTestId("next-match-card");
  const teams = Array.from(document.querySelectorAll(".team-row span:last-child")).map((node) => node.textContent);
  expect(teams).toEqual(["Bahia", "Grêmio"]);
  expect(card.querySelector(".score-card")).not.toHaveClass("score-card--with-team-talk");
  expect(card.querySelector(".score-card-actions")).not.toBeInTheDocument();
  expect(screen.getByTestId("next-match-home-team").previousElementSibling).toHaveAttribute("src", "/gremio.svg");
  expect(screen.queryByRole("heading", { name: "Bahia x Grêmio" })).not.toBeInTheDocument();
  expect(screen.queryByRole("link", { name: "Read the match preview" })).not.toBeInTheDocument();
});

test("falls back for the crest and city when the public schedule has no extra details", () => {
  render(<ProximaPartidaCard partida={partida({ home: true, enriched: false })} />);

  expect(screen.getByText("B")).toHaveClass("team-crest--away");
  expect(screen.queryByText("Porto Alegre, Brazil")).not.toBeInTheDocument();
});

function partida(options: { home: boolean; teamTalkSlug?: string; enriched?: boolean }): ProximaPartida {
  const enriched = options.enriched ?? true;
  return {
    match: { season: "2026", competition: "Brazilian Championship", phase: "Single Round", round: "15", opponent: "Bahia" },
    home: options.home,
    opponentCrestUrl: enriched ? "https://img.example/bahia.svg" : undefined,
    kickoffUtc: "2026-08-09T00:30:00Z",
    stadium: "Grêmio Arena",
    stadiumCity: enriched ? "Porto Alegre" : undefined,
    stadiumCountry: enriched ? "Brazil" : undefined,
    teamTalkSlug: options.teamTalkSlug,
  };
}
