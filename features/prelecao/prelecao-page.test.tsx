import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { PrelecaoPage } from "./prelecao-page";
import type { PublicPrelecao } from "./prelecao-api";

test("shows exactly the three editorial sections in order", () => {
  render(<PrelecaoPage prelecao={prelecao()} />);

  expect(Array.from(document.querySelectorAll(".prelecao-section h2")).map((heading) => heading.textContent)).toEqual([
    "Watch out, Grêmio!",
    "The path to victory",
  ]);
  expect(screen.getByRole("heading", { name: "Probable lineup" })).toBeInTheDocument();
});

test("lineup block appears only when there is a likely-lineup section", () => {
  const { rerender } = render(<PrelecaoPage prelecao={prelecao({ withLineupSection: true })} />);
  expect(screen.getByRole("heading", { name: "Probable lineup" })).toBeInTheDocument();

  rerender(<PrelecaoPage prelecao={prelecao({ withLineupSection: false })} />);
  expect(screen.queryByRole("heading", { name: "Probable lineup" })).not.toBeInTheDocument();
});

test("narrative splits paragraphs without injecting HTML", () => {
  render(<PrelecaoPage prelecao={prelecao({ body: "First.\n\n<strong>Segundo.</strong>" })} />);

  expect(screen.getByText("First.")).toBeInTheDocument();
  expect(screen.getByText("<strong>Segundo.</strong>")).toBeInTheDocument();
  expect(document.querySelector("strong")).toBeNull();
});

test("header identifies the opponent, competition, venue, and kickoff time", () => {
  render(<PrelecaoPage prelecao={prelecao()} />);

  expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Bahia");
  expect(screen.queryByText("Grêmio x Bahia")).not.toBeInTheDocument();
  expect(screen.getByText("Brazilian Championship · Single Round · Round 15")).toBeInTheDocument();
  expect(screen.getByText("Grêmio Arena")).toBeInTheDocument();
  expect(screen.getByText("Saturday, August 8 at 9:30 PM")).toBeInTheDocument();
});

test("opponent remains the heading when Grêmio is away", () => {
  render(<PrelecaoPage prelecao={prelecao({ home: false })} />);

  expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Bahia");
  expect(screen.queryByText("Bahia x Grêmio")).not.toBeInTheDocument();
});

test("header falls back when the venue city is missing", () => {
  render(<PrelecaoPage prelecao={prelecao({ enriched: false })} />);

  expect(screen.queryByText("Porto Alegre, Brasil")).not.toBeInTheDocument();
});

test("pitch represents the eleven starters", () => {
  render(<PrelecaoPage prelecao={prelecao()} />);

  const pitch = screen.getByRole("img", { name: "Vertical pitch showing Bahia’s probable starters" });
  expect(pitch.querySelectorAll(".pitch-player")).toHaveLength(11);
  expect(screen.queryByRole("list", { name: "Probable starters" })).not.toBeInTheDocument();
});

test("indicates players without an average position", () => {
  render(<PrelecaoPage prelecao={prelecao({ missingPosition: true })} />);

  expect(screen.getByText("No average position available for: Kannemann")).toBeInTheDocument();
});

test("shows supporting evidence in a collapsible section", () => {
  render(<PrelecaoPage prelecao={prelecao()} />);

  expect(screen.getAllByText("How we reached this conclusion")).toHaveLength(3);
  expect(screen.getByText("caution: high regains on the right")).toBeInTheDocument();
});

test("does not show the evidence section when no public support is provided", () => {
  render(<PrelecaoPage prelecao={prelecao({ withoutIncidences: true })} />);

  expect(screen.queryByText("How we reached this conclusion")).not.toBeInTheDocument();
});

test("does not show the missing-position note when all players have coordinates", () => {
  render(<PrelecaoPage prelecao={prelecao()} />);

  expect(screen.queryByText(/No average position available for:/)).not.toBeInTheDocument();
});

function prelecao(options: {
  withLineupSection?: boolean;
  body?: string;
  home?: boolean;
  missingPosition?: boolean;
  withoutIncidences?: boolean;
  enriched?: boolean;
} = {}): PublicPrelecao {
  const enriched = options.enriched ?? true;
  const sections = [
    {
      id: "watch-out" as const,
      title: "Watch out, Grêmio!",
      body: options.body ?? "Second section.",
      incidences: options.withoutIncidences ? undefined : ["caution: high regains on the right"],
    },
    {
      id: "path" as const,
      title: "The path to victory",
      body: "Third section.",
      incidences: options.withoutIncidences ? [] : ["path: space behind the fullback"],
    },
  ];

  return {
    slug: "2026-brasileirao-fase-unica-15-bahia",
    match: { season: "2026", competition: "Brazilian Championship", phase: "Single Round", round: "15", opponent: "Bahia" },
    opponentCrestUrl: enriched ? "https://img.example/bahia.svg" : undefined,
    kickoffUtc: "2026-08-09T00:30:00Z",
    stadium: "Grêmio Arena",
    stadiumCity: enriched ? "Porto Alegre" : undefined,
    stadiumCountry: enriched ? "Brazil" : undefined,
    home: options.home ?? true,
    deliveredAt: "2026-08-08T12:00:00Z",
    sections: options.withLineupSection === false ? sections : [
      { id: "likely-lineup", title: "Probable lineup", body: "The probable lineup.", incidences: options.withoutIncidences ? undefined : ["lineup: same core lineup in recent matches"] },
      ...sections,
    ],
    lineup: {
      formation: "4-2-3-1",
      headCoach: "Rogério Ceni",
      primaryColor: "#5aa7ff",
      secondaryColor: "#111827",
      players: [
        player("Tiago Volpi", 1, 4, 50),
        player("João Pedro", 18, 22, 82),
        player("Gustavo Martins", 53, 18, 62),
        player("Kannemann", 4, options.missingPosition ? null : 18, 38),
        player("Reinaldo", 6, 24, 18),
        player("Villasanti", 20, 46, 42),
        player("Dodi", null, 50, 56),
        player("Cristaldo", 10, 68, 48),
        player("Pavón", 21, 78, 78),
        player("Soteldo", 7, 80, 22),
        player("Braithwaite", 22, 92, 50),
      ],
    },
  };
}

function player(name: string, number: number | null, x: number | null, y: number | null) {
  return {
    name,
    number,
    position: "Starter",
    x,
    y,
  };
}
