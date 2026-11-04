import { expect, test } from "vitest";
import { formatKickoff } from "./format-kickoff";

test("formata data no fuso de São Paulo sem depender do navegador", () => {
  expect(formatKickoff("2026-08-09T00:30:00Z")).toBe("sábado, 8 de agosto, 21h30");
});
