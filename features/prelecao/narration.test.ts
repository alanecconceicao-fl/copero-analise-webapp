import { expect, test } from "vitest";
import { paragraphs } from "./narration";

test("mantém corpo de um parágrafo como texto puro", () => {
  expect(paragraphs("Grêmio pressiona pelo lado direito.")).toEqual(["Grêmio pressiona pelo lado direito."]);
});

test("quebra múltiplos parágrafos e ignora linhas vazias", () => {
  expect(paragraphs("Primeiro bloco.\n\n Segundo bloco.\n\n\nTerceiro bloco. ")).toEqual([
    "Primeiro bloco.",
    "Segundo bloco.",
    "Terceiro bloco.",
  ]);
});
