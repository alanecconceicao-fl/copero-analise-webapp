// Fixed copy for v0 (AC 10) — user-facing text stays pt-BR.
// DRAFT written against _docs/guia-voz.md; the author reviews/edits before
// release (HITL — content is his gate).
export type CarouselItem = {
  id: string;
  kicker: string;
  title: string;
  text: string;
  link?: { href: string; label: string };
};

export const carouselItems: CarouselItem[] = [
  {
    id: "o-que-e",
    kicker: "Comece por aqui",
    title: "O que é o Copero Análise",
    text: "Análise de qualidade com aquela conversa que só acontece na arquibancada.",
    link: { href: "/o-que-e", label: "Saiba mais" },
  },
  {
    id: "prelecao",
    kicker: "Pré-jogo",
    title: "Preleção",
    text: "Como o adversário joga, onde mora o perigo e onde a peleia se decide.",
  },
  {
    id: "jornada",
    kicker: "Dia de jogo",
    title: "Jornada do Copero",
    text: "Escalação confirmada, o gremiovalo com o melhor do primeiro tempo e o pós-jogo com comentários do que rolou.",
  },
];

export const sellingText =
  "Bah, se liga: a tua análise do Grêmio tá prestes a ficar diferente. " +
  "Preleção antes do jogo, jornada no dia da bola rolar, resenha quente na " +
  "saída do vestiário, tudo no teu bolso, na voz de quem tá contigo na " +
  "arquibancada. Fica ligado: o lançamento tá chegando.";

export const autoAdvanceMs = 5000;
