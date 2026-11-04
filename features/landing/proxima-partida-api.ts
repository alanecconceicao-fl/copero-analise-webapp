import { backendGetJson } from "../../shared/backend";
import { FEATURE_PRELECAO_PUBLICA, featureFlags } from "../feature-flags/feature-flags";
import type { MatchIdentity } from "../match-details/match-details-api";

export type ProximaPartida = {
  match: MatchIdentity;
  home: boolean;
  opponentCrestUrl?: string;
  kickoffUtc: string;
  stadium: string;
  stadiumCity?: string;
  stadiumCountry?: string;
  teamTalkSlug?: string;
};

export async function fetchProximaPartida(): Promise<ProximaPartida | null> {
  if (!await featureFlags.isEnabled(FEATURE_PRELECAO_PUBLICA)) {
    return null;
  }

  return backendGetJson<ProximaPartida>("/api/matches/next/public");
}
