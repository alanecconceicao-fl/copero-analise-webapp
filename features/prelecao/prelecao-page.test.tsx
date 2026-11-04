import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { PrelecaoPage } from "./prelecao-page";
import type { PublicPrelecao } from "./prelecao-api";

test("mostra exatamente as três seções editoriais na ordem", () => {
  render(<PrelecaoPage prelecao={prelecao()} />);

  expect(Array.from(document.querySelectorAll(".prelecao-section h2")).map((heading) => heading.textContent)).toEqual([
    "Abre o olho, Grêmio!",
    "O caminho das pedras",
  ]);
  expect(screen.getByRole("heading", { name: "Provável escalação" })).toBeInTheDocument();
});

test("bloco de escalação aparece só quando há seção likely-lineup", () => {
  const { rerender } = render(<PrelecaoPage prelecao={prelecao({ withLineupSection: true })} />);
  expect(screen.getByRole("heading", { name: "Provável escalação" })).toBeInTheDocument();

  rerender(<PrelecaoPage prelecao={prelecao({ withLineupSection: false })} />);
  expect(screen.queryByRole("heading", { name: "Provável escalação" })).not.toBeInTheDocument();
});

test("narração quebra parágrafos sem injetar HTML", () => {
  render(<PrelecaoPage prelecao={prelecao({ body: "Primeiro.\n\n<strong>Segundo.</strong>" })} />);

  expect(screen.getByText("Primeiro.")).toBeInTheDocument();
  expect(screen.getByText("<strong>Segundo.</strong>")).toBeInTheDocument();
  expect(document.querySelector("strong")).toBeNull();
});

test("header identifica adversário, competição, local e horário", () => {
  render(<PrelecaoPage prelecao={prelecao()} />);

  expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Bahia");
  expect(screen.queryByText("Grêmio x Bahia")).not.toBeInTheDocument();
  expect(screen.getByText("Brasileirão · Fase única · Rodada 15")).toBeInTheDocument();
  expect(screen.getByText("Arena do Grêmio")).toBeInTheDocument();
  expect(screen.getByText("sábado, 8 de agosto, 21h30")).toBeInTheDocument();
});

test("título continua sendo o adversário fora de casa", () => {
  render(<PrelecaoPage prelecao={prelecao({ home: false })} />);

  expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Bahia");
  expect(screen.queryByText("Bahia x Grêmio")).not.toBeInTheDocument();
});

test("header degrada sem cidade do adversário", () => {
  render(<PrelecaoPage prelecao={prelecao({ enriched: false })} />);

  expect(screen.queryByText("Porto Alegre, Brasil")).not.toBeInTheDocument();
});

test("campo é a representação dos onze titulares", () => {
  render(<PrelecaoPage prelecao={prelecao()} />);

  const pitch = screen.getByRole("img", { name: "Campo vertical com titulares prováveis do Bahia" });
  expect(pitch.querySelectorAll(".pitch-player")).toHaveLength(11);
  expect(screen.queryByRole("list", { name: "Titulares prováveis" })).not.toBeInTheDocument();
});

test("sinaliza quem não tem posição média", () => {
  render(<PrelecaoPage prelecao={prelecao({ missingPosition: true })} />);

  expect(screen.getByText("Sem posição média em campo: Kannemann")).toBeInTheDocument();
});

test("mostra incidências de sustentação em collapse", () => {
  render(<PrelecaoPage prelecao={prelecao()} />);

  expect(screen.getAllByText("De onde vem essa leitura")).toHaveLength(3);
  expect(screen.getByText("cuidado: recuperações altas no lado direito")).toBeInTheDocument();
});

test("não mostra collapse de incidências quando a seção não traz sustentação pública", () => {
  render(<PrelecaoPage prelecao={prelecao({ withoutIncidences: true })} />);

  expect(screen.queryByText("De onde vem essa leitura")).not.toBeInTheDocument();
});

test("não mostra legenda de posição ausente quando todos têm coordenada", () => {
  render(<PrelecaoPage prelecao={prelecao()} />);

  expect(screen.queryByText(/Sem posição média em campo:/)).not.toBeInTheDocument();
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
      title: "Abre o olho, Grêmio!",
      body: options.body ?? "Segundo bloco.",
      incidences: options.withoutIncidences ? undefined : ["cuidado: recuperações altas no lado direito"],
    },
    {
      id: "path" as const,
      title: "O caminho das pedras",
      body: "Terceiro bloco.",
      incidences: options.withoutIncidences ? [] : ["caminho: espaço nas costas do lateral"],
    },
  ];

  return {
    slug: "2026-brasileirao-fase-unica-15-bahia",
    match: { season: "2026", competition: "Brasileirão", phase: "Fase única", round: "15", opponent: "Bahia" },
    opponentCrestUrl: enriched ? "https://img.example/bahia.svg" : undefined,
    kickoffUtc: "2026-08-09T00:30:00Z",
    stadium: "Arena do Grêmio",
    stadiumCity: enriched ? "Porto Alegre" : undefined,
    stadiumCountry: enriched ? "Brasil" : undefined,
    home: options.home ?? true,
    deliveredAt: "2026-08-08T12:00:00Z",
    sections: options.withLineupSection === false ? sections : [
      { id: "likely-lineup", title: "Provável escalação", body: "A base provável.", incidences: options.withoutIncidences ? undefined : ["escalação: base repetida nos últimos jogos"] },
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
    position: "Titular",
    x,
    y,
  };
}
