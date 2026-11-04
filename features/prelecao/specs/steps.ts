import { expect } from "@playwright/test";
import { createBdd } from "playwright-bdd";
import { openDevice, setFeatureFlagCookieOverride, test, UA } from "../../support/specs/bdd";

const { Given, Then } = createBdd(test);

Given("the persisted public briefing flag is off", async () => {
  if (!process.env.PLAYWRIGHT_BASE_URL) {
    await setPrelecaoPublica(false);
  }
});

Given("the consent cookie overrides the flag", async ({ world }) => {
  await setFeatureFlagCookieOverride(world, true);
});

Given("the consent cookie is not present", async ({ world }) => {
  await setFeatureFlagCookieOverride(world, false);
});

Given(
  "the fan opens the briefing {string} on a real mobile phone",
  async ({ browser, world }, slug: string) => {
    await openDevice(world, browser, UA.phone, { width: 390, height: 844 }, true, `/prelecao/${slug}`);
  },
);

Given("a social crawler opens the briefing {string}", async ({ browser, world }, slug: string) => {
  await openDevice(world, browser, UA.whatsapp, { width: 390, height: 844 }, false, `/prelecao/${slug}`);
});

Given(
  "someone opens the briefing {string} on a computer",
  async ({ browser, world }, slug: string) => {
    await openDevice(world, browser, UA.desktop, { width: 1440, height: 900 }, false, `/prelecao/${slug}`);
  },
);

Then("they see the briefing for {string}", async ({ world }, fixture: string) => {
  await expect(world.page.getByRole("heading", { level: 1 })).toHaveText(fixture);
  await expect(world.page.getByText("Grêmio Arena")).toBeVisible();
});

Then("the briefing contains exactly these three sections, in this order", async ({ world }) => {
  await expect(world.page.locator(".prelecao-lineup h2, .prelecao-section h2")).toHaveText([
    "Probable lineup",
    "Watch out, Grêmio!",
    "The path to victory",
  ]);
});

Then("the analysis narrates the data without exposing statistics or JSON", async ({ world }) => {
  await expect(world.page.getByText(/often build short and accelerate/)).toBeVisible();
  await expect(world.page.getByText(/attacking transition: two goals/)).toBeHidden();
  await expect(world.page.getByText(/schemaVersion|sourceUses|previousMatches|\"sections\"/)).toHaveCount(0);
  await expect(world.page.getByRole("heading", { name: /statistics/i })).toHaveCount(0);
});

Then("the vertical pitch shows the eleven starters with numbers, colors, and positions", async ({ world }) => {
  const pitch = world.page.getByRole("img", { name: "Vertical pitch showing Bahia’s probable starters" });
  await expect(pitch).toBeVisible();
  await expect(pitch.locator(".pitch-player")).toHaveCount(11);
  await expect(pitch.getByTestId("pitch-token-Everaldo")).toHaveText("9");
  await expect(pitch.getByTestId("pitch-token-Everaldo")).toHaveCSS("background-color", "rgb(90, 167, 255)");
  await expect(pitch.getByTestId("pitch-token-Everaldo")).toHaveCSS("color", "rgb(17, 24, 39)");

  const goalkeeper = await pitch.getByTestId("pitch-player-Marcos Felipe").boundingBox();
  const striker = await pitch.getByTestId("pitch-player-Everaldo").boundingBox();
  expect(goalkeeper).not.toBeNull();
  expect(striker).not.toBeNull();
  expect(goalkeeper!.y).toBeGreaterThan(striker!.y);
});

Then("they are redirected to the briefing {string}", async ({ world }, slug: string) => {
  await expect(world.page).toHaveURL(new RegExp(`/prelecao/${slug}$`));
});

Then("they see that the analysis is unavailable", async ({ world }) => {
  await expect(world.page.getByRole("heading", { name: "Page not found" })).toBeVisible();
});

Then("the landing page does not promote the briefing", async ({ browser, world }) => {
  await world.page.context().close();
  await openDevice(world, browser, UA.phone, { width: 390, height: 844 }, true);
  await expect(world.page.getByTestId("next-match-card")).toHaveCount(0);
});

Then("the social preview is for the briefing", async ({ world }) => {
  await expect(world.page.locator('meta[property="og:title"]')).toHaveAttribute(
    "content",
    "Match Preview: Grêmio x Bahia",
  );
  await expect(world.page.locator('meta[property="og:description"]')).toHaveAttribute(
    "content",
    "Match analysis at Grêmio Arena.",
  );
});

async function setPrelecaoPublica(enabled: boolean) {
  const response = await fetch("http://127.0.0.1:3199/__test__/feature-flags/prelecao-publica", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ enabled }),
  });
  expect(response.ok).toBe(true);
}
