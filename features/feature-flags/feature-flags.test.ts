import { afterEach, expect, test, vi } from "vitest";
import { FEATURE_PRELECAO_PUBLICA, featureFlags } from "./feature-flags";

vi.mock("../../shared/backend", () => ({
  backendGetJson: vi.fn(),
}));
vi.mock("../../shared/feature-flag-override", () => ({
  prelecaoPublicaCookieOverride: vi.fn(),
}));

afterEach(() => {
  vi.restoreAllMocks();
});

test("lê a flag da Preleção pelo backend", async () => {
  const { backendGetJson } = await import("../../shared/backend");
  const { prelecaoPublicaCookieOverride } = await import("../../shared/feature-flag-override");
  vi.mocked(prelecaoPublicaCookieOverride).mockResolvedValue(false);
  vi.mocked(backendGetJson).mockResolvedValue({
    name: FEATURE_PRELECAO_PUBLICA,
    enabled: true,
  });

  await expect(featureFlags.isEnabled(FEATURE_PRELECAO_PUBLICA)).resolves.toBe(true);
  expect(backendGetJson).toHaveBeenCalledWith("/api/feature-flags/prelecao-publica");
});

test("cookie de aceitação habilita a Preleção sem consultar o estado persistido", async () => {
  const { backendGetJson } = await import("../../shared/backend");
  const { prelecaoPublicaCookieOverride } = await import("../../shared/feature-flag-override");
  vi.mocked(prelecaoPublicaCookieOverride).mockResolvedValue(true);

  await expect(featureFlags.isEnabled(FEATURE_PRELECAO_PUBLICA)).resolves.toBe(true);
  expect(backendGetJson).not.toHaveBeenCalled();
});

test.each([
  ["estado ausente", null],
  ["flag desligada", { name: FEATURE_PRELECAO_PUBLICA, enabled: false }],
  ["resposta de outra flag", { name: "FEATURE_OUTRA", enabled: true }],
])("falha fechada quando %s", async (_case, state) => {
  const { backendGetJson } = await import("../../shared/backend");
  const { prelecaoPublicaCookieOverride } = await import("../../shared/feature-flag-override");
  vi.mocked(prelecaoPublicaCookieOverride).mockResolvedValue(false);
  vi.mocked(backendGetJson).mockResolvedValue(state);

  await expect(featureFlags.isEnabled(FEATURE_PRELECAO_PUBLICA)).resolves.toBe(false);
});
