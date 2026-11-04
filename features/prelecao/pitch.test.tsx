import { render, screen, within } from "@testing-library/react";
import { expect, test } from "vitest";
import { Pitch } from "./pitch";
import type { PrelecaoLineupPlayer } from "./prelecao-api";

test("campo tem papel de imagem e mostra só jogadores posicionáveis", () => {
  render(<Pitch players={[player("Atacante", 9, 90, 50), player("Sem posição", 4, null, 40)]} primaryColor="#5aa7ff" secondaryColor="#111827" opponent="Bahia" />);

  const pitch = screen.getByRole("img", { name: "Campo vertical com titulares prováveis do Bahia" });
  expect(within(pitch).getByText("Atacante")).toBeInTheDocument();
  expect(within(pitch).queryByText("Sem posição")).not.toBeInTheDocument();
});

test("token usa cores de uniforme e preserva nome fora do token", () => {
  render(<Pitch players={[player("Cristaldo", 10, 68, 48)]} primaryColor="#5aa7ff" secondaryColor="#111827" opponent="Bahia" />);

  const token = screen.getByTestId("pitch-token-Cristaldo");
  expect(token).toHaveTextContent("10");
  expect(token).toHaveStyle({ background: "#5aa7ff", color: "#111827", borderColor: "#111827" });
  expect(screen.getByText("Cristaldo")).toHaveClass("pitch-player-name");
});

test("jogador sem número fica sem dígito no token", () => {
  render(<Pitch players={[player("Dodi", null, 50, 50)]} primaryColor="#5aa7ff" secondaryColor="#111827" opponent="Bahia" />);

  expect(screen.getByTestId("pitch-token-Dodi")).toHaveTextContent("");
});

test("posição CSS vem da conversão vertical", () => {
  render(<Pitch players={[player("Centroavante", 9, 100, 0)]} primaryColor="#5aa7ff" secondaryColor="#111827" opponent="Bahia" />);

  expect(screen.getByTestId("pitch-player-Centroavante")).toHaveStyle({ top: "6%", left: "91%" });
});

function player(name: string, number: number | null, x: number | null, y: number | null): PrelecaoLineupPlayer {
  return {
    name,
    number,
    position: "Titular",
    x,
    y,
  };
}
