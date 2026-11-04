import { type Browser, type BrowserContext, type Page } from "@playwright/test";
import { test as base } from "playwright-bdd";
import { FeatureFlagOverrideCookie, FeatureFlagOverrideEnabledValue } from "../../../shared/feature-flag-contract";

export const UA = {
  phone:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1",
  tablet:
    "Mozilla/5.0 (Linux; Android 14; SM-X710) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0 Safari/537.36",
  desktop:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15",
  whatsapp: "WhatsApp/2.23.20",
};

export type World = { page: Page; featureFlagOverride?: boolean };

export const test = base.extend<{ world: World }>({
  world: async ({}, use) => {
    const world = {} as World;
    await use(world);
    await world.page?.context().close();
  },
});

export async function openDevice(
  world: World,
  browser: Browser,
  userAgent: string,
  viewport: { width: number; height: number },
  hasTouch = false,
  path = "/",
) {
  const context = await browser.newContext({ userAgent, viewport, hasTouch });
  if (world.featureFlagOverride) {
    await installFeatureFlagOverride(context);
  }

  world.page = await context.newPage();

  await world.page.clock.install();
  await world.page.goto(path);
  await world.page.waitForTimeout(500);
}

export async function setFeatureFlagCookieOverride(world: World, enabled: boolean) {
  world.featureFlagOverride = enabled;
  
  if (!world.page) {
    return;
  }

  if (enabled) {
    await installFeatureFlagOverride(world.page.context());
  } else {
    await world.page.context().clearCookies({ name: FeatureFlagOverrideCookie });
  }

  await world.page.reload();
}

async function installFeatureFlagOverride(context: BrowserContext) {
  const url = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3100";
  await context.addCookies([{
    name: FeatureFlagOverrideCookie,
    value: FeatureFlagOverrideEnabledValue,
    url,
  }]);

  const installed = (await context.cookies(url)).some(
    (cookie) => cookie.name === FeatureFlagOverrideCookie
      && cookie.value === FeatureFlagOverrideEnabledValue,
  );
  if (!installed) {
    throw new Error(`operational cookie ${FeatureFlagOverrideCookie} was not installed for ${url}`);
  }
}
