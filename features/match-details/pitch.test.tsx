import { render, screen, within } from "@testing-library/react";
import { expect, test } from "vitest";
import { Pitch } from "./pitch";
import type { PrelecaoLineupPlayer } from "./match-details-api";

test("pitch has image semantics and shows only players with positions", () => {
  render(<Pitch players={[player("Striker", 9, 90, 50), player("Unpositioned player", 4, null, 40)]} primaryColor="#5aa7ff" secondaryColor="#111827" opponent="Adversary FC" />);

  const pitch = screen.getByRole("img", { name: "Vertical pitch showing Adversary FC’s probable starters" });
  expect(within(pitch).getByText("Striker")).toBeInTheDocument();
  expect(within(pitch).queryByText("Unpositioned player")).not.toBeInTheDocument();
});

test("token uses kit colors and displays the player name separately", () => {
  render(<Pitch players={[player("Cristaldo", 10, 68, 48)]} primaryColor="#5aa7ff" secondaryColor="#111827" opponent="Adversary FC" />);

  const token = screen.getByTestId("pitch-token-Cristaldo");
  expect(token).toHaveTextContent("10");
  expect(token).toHaveStyle({ background: "#5aa7ff", color: "#111827", borderColor: "#111827" });
  expect(screen.getByText("Cristaldo")).toHaveClass("pitch-player-name");
});

test("player without a number has no digit in the token", () => {
  render(<Pitch players={[player("Dodi", null, 50, 50)]} primaryColor="#5aa7ff" secondaryColor="#111827" opponent="Adversary FC" />);

  expect(screen.getByTestId("pitch-token-Dodi")).toHaveTextContent("");
});

test("CSS position comes from the vertical coordinate mapping", () => {
  render(<Pitch players={[player("Center forward", 9, 100, 0)]} primaryColor="#5aa7ff" secondaryColor="#111827" opponent="Adversary FC" />);

  expect(screen.getByTestId("pitch-player-Center forward")).toHaveStyle({ top: "6%", left: "91%" });
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
