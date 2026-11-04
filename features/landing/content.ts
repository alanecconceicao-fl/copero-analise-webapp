// Fixed copy for v0 (AC 10) — user-facing text is in English.
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
    kicker: "Start here",
    title: "About Copero Analysis",
    text: "Quality analysis with the kind of conversation you only hear in the stands.",
    link: { href: "/o-que-e", label: "Learn more" },
  },
  {
    id: "prelecao",
    kicker: "Before the match",
    title: "Match Preview",
    text: "How the opponent plays, where the danger lies, and where the match will be decided.",
  },
  {
    id: "jornada",
    kicker: "Match day",
    title: "Copero Matchday",
    text: "Confirmed lineup, the best of the first half at halftime, and a post-match recap of what happened.",
  },
];

export const sellingText =
  "Get ready: your Grêmio analysis is about to change. " +
  "Match Preview before kickoff, matchday coverage as the action unfolds, and a lively post-match recap, " +
  "all in your pocket, told by someone right there with you in the " +
  "stands. Stay tuned: launch is coming soon.";

export const autoAdvanceMs = 5000;
