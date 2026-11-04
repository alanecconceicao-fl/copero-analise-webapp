import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { backendGetJson } from "./backend";

vi.mock("./feature-flag-override", () => ({
  featureFlagOverrideHeaders: vi.fn(),
}));

beforeEach(async () => {
  const { featureFlagOverrideHeaders } = await import("./feature-flag-override");
  vi.mocked(featureFlagOverrideHeaders).mockResolvedValue(new Headers());
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

test("busca JSON no backend app com cache desligado e timeout curto", async () => {
  vi.stubGlobal("fetch", vi.fn(async () => Response.json({ ok: true })));

  await expect(backendGetJson("/api/matches/next/public")).resolves.toEqual({ ok: true });

  expect(fetch).toHaveBeenCalledWith("http://backend-app:8080/api/matches/next/public", {
    cache: "no-store",
    headers: expect.any(Headers),
    signal: expect.any(AbortSignal),
  });
});

test("usa BACKEND_APP_URL quando configurada", async () => {
  vi.stubEnv("BACKEND_APP_URL", "http://localhost:3199");
  vi.stubGlobal("fetch", vi.fn(async () => Response.json({ ok: true })));

  await backendGetJson("/api/matches/team-talk/public?slug=velho");

  expect(fetch).toHaveBeenCalledWith("http://localhost:3199/api/matches/team-talk/public?slug=velho", {
    cache: "no-store",
    headers: expect.any(Headers),
    signal: expect.any(AbortSignal),
  });
});

test("propaga o override derivado do cookie somente como header interno", async () => {
  const { featureFlagOverrideHeaders } = await import("./feature-flag-override");
  vi.mocked(featureFlagOverrideHeaders).mockResolvedValue(new Headers({
    "X-Copero-Feature-Flag-Override": "FEATURE_PRELECAO_PUBLICA",
  }));
  vi.stubGlobal("fetch", vi.fn(async () => Response.json({ ok: true })));

  await backendGetJson("/api/matches/team-talk/public?slug=Adversary FC");

  const init = vi.mocked(fetch).mock.calls[0][1];
  expect(new Headers(init?.headers).get("X-Copero-Feature-Flag-Override")).toBe(
    "FEATURE_PRELECAO_PUBLICA",
  );
});

test("404 retorna null para a camada de feature decidir notFound ou omitir card", async () => {
  vi.stubGlobal("fetch", vi.fn(async () => new Response(null, { status: 404 })));

  await expect(backendGetJson("/api/matches/team-talk/public?slug=rascunho")).resolves.toBeNull();
});

test("5xx vira erro genérico e registra contexto sem vazar detalhe para UI", async () => {
  const error = vi.spyOn(console, "error").mockImplementation(() => undefined);
  vi.stubGlobal("fetch", vi.fn(async () => new Response("boom", { status: 503 })));

  await expect(backendGetJson("/api/matches/next/public")).rejects.toThrow("O serviço está indisponível.");
  expect(error).toHaveBeenCalledWith("backend app request failed", expect.objectContaining({
    path: "/api/matches/next/public",
    status: 503,
  }));
});

test("falha de rede ou timeout vira o mesmo erro genérico", async () => {
  const error = vi.spyOn(console, "error").mockImplementation(() => undefined);
  vi.stubGlobal("fetch", vi.fn(async () => {
    throw new Error("The operation was aborted.");
  }));

  await expect(backendGetJson("/api/matches/next/public")).rejects.toThrow("O serviço está indisponível.");
  expect(error).toHaveBeenCalledWith("backend app request failed", expect.objectContaining({
    path: "/api/matches/next/public",
    error: "The operation was aborted.",
  }));
});

test("falha sem objeto Error também vira erro genérico", async () => {
  const error = vi.spyOn(console, "error").mockImplementation(() => undefined);
  vi.stubGlobal("fetch", vi.fn(async () => {
    throw "aborted";
  }));

  await expect(backendGetJson("/api/matches/next/public")).rejects.toThrow("O serviço está indisponível.");
  expect(error).toHaveBeenCalledWith("backend app request failed", expect.objectContaining({
    path: "/api/matches/next/public",
    error: "aborted",
  }));
});
