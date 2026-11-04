import { afterEach, expect, test, vi } from "vitest";
import { fetchPrelecao } from "./prelecao-api";

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

test("busca Preleção publicada por slug", async () => {
  const { backendGetJson } = await import("../../shared/backend");
  const { featureFlags } = await import("../feature-flags/feature-flags");
  vi.mocked(featureFlags.isEnabled).mockResolvedValue(true);
  vi.mocked(backendGetJson).mockResolvedValue({ slug: "canonico" });

  await expect(fetchPrelecao("velho")).resolves.toEqual({
    slug: "canonico",
  });
  expect(backendGetJson).toHaveBeenCalledWith(
    "/api/matches/team-talk/public?slug=velho",
  );
});

test("codifica slug antes de chamar o backend", async () => {
  const { backendGetJson } = await import("../../shared/backend");
  const { featureFlags } = await import("../feature-flags/feature-flags");
  vi.mocked(featureFlags.isEnabled).mockResolvedValue(true);
  vi.mocked(backendGetJson).mockResolvedValue(null);

  await fetchPrelecao("rodada velha");

  expect(backendGetJson).toHaveBeenCalledWith(
    "/api/matches/team-talk/public?slug=rodada%20velha",
  );
});

test("não busca nem expõe a Preleção com a feature flag desligada", async () => {
  const { backendGetJson } = await import("../../shared/backend");
  const { featureFlags } = await import("../feature-flags/feature-flags");
  vi.mocked(featureFlags.isEnabled).mockResolvedValue(false);

  await expect(fetchPrelecao("canonico")).resolves.toBeNull();
  expect(backendGetJson).not.toHaveBeenCalled();
});
