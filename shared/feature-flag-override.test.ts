import { afterEach, expect, test, vi } from "vitest";
import {
  FeatureFlagOverrideCookie,
  FeatureFlagOverrideHeader,
  featureFlagOverrideHeaders,
  prelecaoPublicaCookieOverride,
} from "./feature-flag-override";

const cookieGet = vi.fn();

vi.mock("next/headers", () => ({
  cookies: vi.fn(async () => ({ get: cookieGet })),
}));

afterEach(() => {
  vi.clearAllMocks();
});

test("aceita somente o cookie explícito de override", async () => {
  cookieGet.mockImplementation((name: string) =>
    name === FeatureFlagOverrideCookie ? { value: "enabled" } : undefined,
  );

  await expect(prelecaoPublicaCookieOverride()).resolves.toBe(true);
  expect((await featureFlagOverrideHeaders()).get(FeatureFlagOverrideHeader)).toBe(
    "FEATURE_PRELECAO_PUBLICA",
  );
});

test.each([undefined, "disabled", "true", "1"])(
  "rejeita valor de cookie %s",
  async (value) => {
    cookieGet.mockReturnValue(value === undefined ? undefined : { value });

    await expect(prelecaoPublicaCookieOverride()).resolves.toBe(false);
  },
);
