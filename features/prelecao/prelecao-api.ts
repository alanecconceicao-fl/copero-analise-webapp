import { backendGetJson } from "../../shared/backend";
import { FEATURE_PRELECAO_PUBLICA, featureFlags } from "../feature-flags/feature-flags";

export type PrelecaoSectionID = "likely-lineup" | "watch-out" | "path";

export type PrelecaoSection = {
  id: PrelecaoSectionID;
  title: string;
  body: string;
  incidences?: string[];
};

export type PrelecaoLineupPlayer = {
  name: string;
  number: number | null;
  position: string;
  x: number | null;
  y: number | null;
};

export type PrelecaoLineup = {
  formation: string;
  headCoach: string;
  primaryColor: string;
  secondaryColor: string;
  players: PrelecaoLineupPlayer[];
};

export type MatchIdentity = {
  season: string;
  competition: string;
  phase: string;
  round: string;
  opponent: string;
};

export type PublicPrelecao = {
  slug: string;
  match: MatchIdentity;
  opponentCrestUrl?: string;
  kickoffUtc: string;
  stadium: string;
  stadiumCity?: string;
  stadiumCountry?: string;
  home: boolean;
  deliveredAt: string;
  sections: PrelecaoSection[];
  lineup: PrelecaoLineup;
};

export async function fetchPrelecao(slug: string): Promise<PublicPrelecao | null> {
  if (!await featureFlags.isEnabled(FEATURE_PRELECAO_PUBLICA)) {
    return null;
  }

  return backendGetJson<PublicPrelecao>(
    `/api/matches/team-talk/public?slug=${encodeURIComponent(slug)}`,
  );
}
