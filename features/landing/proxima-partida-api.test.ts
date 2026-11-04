import { afterEach, expect, test, vi } from "vitest";
import { fetchProximaPartida } from "./proxima-partida-api";

vi.mock("../../shared/backend", () => ({
  backendGetJson: vi.fn(),
}));
vi.mock("../feature-flags/feature-flags", () => ({
  FEATURE_PRELECAO_PUBLICA: "FEATURE_PRELECAO_PUBLICA",
  featureFlags: { isEnabled: vi.fn() },
}));

afterEach(() => {
  vi.restoreAllMocks();
});

test("busca a próxima partida pública", async () => {
  const { backendGetJson } = await import("../../shared/backend");
  const { featureFlags } = await import("../feature-flags/feature-flags");
  vi.mocked(featureFlags.isEnabled).mockResolvedValue(true);
  vi.mocked(backendGetJson).mockResolvedValue({ match: { opponent: "Bahia" } });

  await expect(fetchProximaPartida()).resolves.toEqual({
    match: { opponent: "Bahia" },
  });
  expect(backendGetJson).toHaveBeenCalledWith(
    "/api/matches/next/public",
  );
});

test("não busca nem anuncia a próxima partida com a feature flag desligada", async () => {
  const { backendGetJson } = await import("../../shared/backend");
  const { featureFlags } = await import("../feature-flags/feature-flags");
  vi.mocked(featureFlags.isEnabled).mockResolvedValue(false);

  await expect(fetchProximaPartida()).resolves.toBeNull();
  expect(backendGetJson).not.toHaveBeenCalled();
});
