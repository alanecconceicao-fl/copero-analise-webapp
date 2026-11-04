// Step definitions for the landing living doc (code in English; the specs —
// the documentation — is in English). Each device "Given" opens its own context:
// the mobile-only rule is about what the device IS (user agent).
import { expect, type Page } from "@playwright/test";
import { createBdd } from "playwright-bdd";
import { openDevice, test, UA } from "../../support/specs/bdd";

const { Given, When, Then } = createBdd(test);

// ── Devices ────────────────────────────────────────────────────────────

Given("the fan opens the page on a real mobile phone", async ({ browser, world }) => {
  await openDevice(world, browser, UA.phone, { width: 390, height: 844 }, true);
});

Given("someone opens the page on a computer", async ({ browser, world }) => {
  await openDevice(world, browser, UA.desktop, { width: 1440, height: 900 });
});

Given("someone opens the page on a tablet", async ({ browser, world }) => {
  await openDevice(world, browser, UA.tablet, { width: 820, height: 1180 }, true);
});

Given(
  "someone opens the page on a computer with a narrow window",
  async ({ browser, world }) => {
    await openDevice(world, browser, UA.desktop, { width: 500, height: 900 });
  },
);

// ── General actions ────────────────────────────────────────────────────────────

When("the page loads", async ({ world }) => {
  await world.page.waitForLoadState();
});

When("they rotate the phone to landscape", async ({ world }) => {
  await world.page.setViewportSize({ width: 844, height: 390 });
});

When("the fan scrolls the page", async ({ world }) => {
  await world.page.mouse.wheel(0, 600);
});

When("the next match content scrolls behind the footer", async ({ world }) => {
  await world.page.setViewportSize({ width: 390, height: 760 });
  const cardContent = world.page.locator(".score-card-meta dd").last();
  const footer = world.page.getByTestId("footer-nav");
  await expect(cardContent).toBeVisible();
  await expect(footer).toBeVisible();

  await cardContent.evaluate((element) => {
    const footer = document.querySelector<HTMLElement>('[data-testid="footer-nav"]');
    if (!footer) throw new Error("footer nav not found");

    const contentRect = element.getBoundingClientRect();
    const footerRect = footer.getBoundingClientRect();
    window.scrollBy(0, contentRect.top - footerRect.top - 8);
  });
});

// ── Landing × notice ─────────────────────────────────────────────────────────

Then("they see the Copero landing page", async ({ world }) => {
  await expect(world.page.getByTestId("carousel")).toBeVisible();
});

Then("they continue to see the landing page normally", async ({ world }) => {
  await expect(world.page.getByTestId("carousel")).toBeVisible();
});

Then(
  "the page says desktop access is not allowed",
  async ({ world }) => {
    await expect(world.page.getByTestId("apenas-no-celular")).toBeVisible();
    await expect(world.page.getByText("desktop access is not allowed")).toBeVisible();
  },
);

// ── Carousel ───────────────────────────────────────────────────────────────

Then("the carousel shows exactly 3 items", async ({ world }) => {
  await expect(world.page.getByTestId("carousel-item")).toHaveCount(3);
});

Then(
  "the items are, in order: {string}, {string}, and {string}",
  async ({ world }, first: string, second: string, third: string) => {
    // Spec names the items by identity, not by display copy (copy is the
    // author's to change): "What is Copero" -> o-que-e, etc.
    const idByName: Record<string, string> = {
      "What is Copero": "o-que-e",
      "Match Preview": "prelecao",
      "Copero Matchday": "jornada",
    };
    const items = world.page.getByTestId("carousel-item");
    await expect(items.nth(0)).toHaveAttribute("data-item-id", idByName[first]);
    await expect(items.nth(1)).toHaveAttribute("data-item-id", idByName[second]);
    await expect(items.nth(2)).toHaveAttribute("data-item-id", idByName[third]);
  },
);

Then(
  "the {string} item links to a page that explores the topic in depth",
  async ({ world }, _item: string) => {
    const firstItem = world.page.getByTestId("carousel-item").first();
    await expect(firstItem.locator('a[href="/what-is-copero"]')).toHaveCount(1);
  },
);

Then(
  "the {string} and {string} items do not have their own pages",
  async ({ world }, _second: string, _third: string) => {
    const items = world.page.getByTestId("carousel-item");
    await expect(items.nth(1).locator("a")).toHaveCount(0);
    await expect(items.nth(2).locator("a")).toHaveCount(0);
  },
);

When("the fan taps the link on the {string} item", async ({ world }, _item: string) => {
  await world.page.getByTestId("carousel-item").first().locator("a").click();
});

Then("they reach the page that explains Copero in depth", async ({ world }) => {
  await expect(world.page.getByTestId("o-que-e")).toBeVisible();
});

async function currentSlide(page: Page): Promise<number> {
  const style = (await page.locator(".carousel-track").getAttribute("style")) ?? "";
  const match = style.match(/translateX\(-(\d+)%\)/);
  return match ? Number(match[1]) / 100 : 0;
}

When("the page stays open without being touched", async ({ world }) => {
  await world.page.clock.fastForward(5100);
});

Then("the carousel advances to the next item automatically", async ({ world }) => {
  expect(await currentSlide(world.page)).toBe(1);
});

async function swipeLeft(page: Page) {
  await page.evaluate(() => {
    const el = document.querySelector('[data-testid="carousel"]')!;
    const touch = (x: number) =>
      new Touch({ identifier: 1, target: el, clientX: x, clientY: 200 });
    el.dispatchEvent(
      new TouchEvent("touchstart", { touches: [touch(300)], bubbles: true }),
    );
    el.dispatchEvent(
      new TouchEvent("touchend", { changedTouches: [touch(120)], bubbles: true }),
    );
  });
}

When("the fan swipes the carousel", async ({ world }) => {
  await swipeLeft(world.page);
});

Then("the carousel advances to the next item", async ({ world }) => {
  expect(await currentSlide(world.page)).toBe(1);
});

Given("the carousel is on the third item", async ({ world }) => {
  await swipeLeft(world.page);
  await swipeLeft(world.page);
  expect(await currentSlide(world.page)).toBe(2);
});

When("the carousel advances", async ({ world }) => {
  await swipeLeft(world.page);
});

Then("it returns to the first item", async ({ world }) => {
  expect(await currentSlide(world.page)).toBe(0);
});

Then(
  "the engaging explanatory app text appears below the carousel",
  async ({ world }) => {
    await expect(world.page.getByTestId("selling-text")).toBeVisible();
  },
);

Then("the next match briefing callout appears", async ({ world }) => {
  const card = world.page.getByTestId("next-match-card");
  await expect(card).toBeVisible();
  await expect(card.getByText("Brazilian Championship")).toBeVisible();
  await expect(card.getByTestId("next-match-home-team")).toHaveText("Team PA");
  await expect(card.getByTestId("next-match-away-team")).toHaveText("Adversary FC");
  await expect(card.getByText("Aug 8 · 9:30 PM · Single Round · Round 15")).toBeVisible();
  await expect(card.getByRole("link", { name: "Read the match preview" })).toHaveAttribute(
    "href",
    "/match-preview/2026-brazilian-championship-single-round-15-adversary-fc",
  );
});

// ── Footer and About Us ──────────────────────────────────────────────────────

Then("the app navigation bar is not shown", async ({ world }) => {
  await expect(world.page.getByTestId("footer-nav")).toHaveCount(0);
});

Then("the navigation bar remains visible at the bottom", async ({ world }) => {
  await expect(world.page.getByTestId("footer-nav")).toBeInViewport();
});

Then("the navigation bar stays in front of the content", async ({ world }) => {
  const overlap = await world.page.locator(".score-card-meta dd").last().evaluate((element) => {
    const rect = element.getBoundingClientRect();
    const footer = document.querySelector<HTMLElement>('[data-testid="footer-nav"]');
    const footerRect = footer?.getBoundingClientRect();
    const overlapTop = footerRect ? Math.max(rect.top, footerRect.top) : 0;
    const overlapBottom = footerRect ? Math.min(rect.bottom, footerRect.bottom) : 0;
    const hitY = overlapTop + (overlapBottom - overlapTop) / 2;
    const topmost = document.elementFromPoint(
      rect.left + rect.width / 2,
      hitY,
    );

    return {
      covered:
        overlapBottom > overlapTop
        && topmost?.closest('[data-testid="footer-nav"]') !== null,
      content: { top: rect.top, bottom: rect.bottom },
      footer: footerRect ? { top: footerRect.top, bottom: footerRect.bottom } : null,
      topmost: topmost instanceof HTMLElement ? `${topmost.tagName}.${topmost.className}` : null,
    };
  });

  expect(overlap.covered, JSON.stringify(overlap)).toBe(true);
});

Then(
  "the footer bar has shortcuts for {string} and {string}",
  async ({ world }, first: string, second: string) => {
    const nav = world.page.getByTestId("footer-nav");
    await expect(nav.getByText(first)).toBeVisible();
    await expect(nav.getByText(second)).toBeVisible();
  },
);

When("the fan taps {string} in the footer", async ({ world }, label: string) => {
  await world.page.getByTestId("footer-nav").getByText(label).click();
});

Then("they reach the About Us page", async ({ world }) => {
  await expect(world.page.getByTestId("sobre-nos")).toBeVisible();
});

Then("they return to the landing page", async ({ world }) => {
  await expect(world.page.getByTestId("carousel")).toBeVisible();
});

Then("they see a brief explanation of Copero Analysis", async ({ world }) => {
  await expect(world.page.getByTestId("sobre-nos")).toContainText("Copero Analysis");
});

Then(
  "they see who is on the project, with an introduction to each person",
  async ({ world }) => {
    await expect(world.page.getByTestId("pessoas").locator("li")).not.toHaveCount(0);
  },
);

// ── AdSense ─────────────────────────────────────────────────────────────────

Given("AdSense does not have an ad to serve yet", async () => {
  // v0 without approval: no client id in the env, the slot renders empty.
});

Then("the AdSense ad slot is present on the page", async ({ world }) => {
  await expect(world.page.getByTestId("adsense-slot")).toHaveCount(1);
});

Then(
  "the whole page appears without gaps or layout breakage",
  async ({ world }) => {
    await expect(world.page.getByTestId("carousel")).toBeVisible();
    await expect(world.page.getByTestId("selling-text")).toBeVisible();
    await expect(world.page.getByTestId("footer-nav")).toBeInViewport();
  },
);

// ── SEO (#38) ───────────────────────────────────────────────────────────────
// The desktop scenarios double as the middleware-matcher regression net:
// robots.txt/sitemap.xml must be readable by a desktop-UA crawler, and the
// notice (what that crawler sees everywhere else) must stay out of the index.

const SITE_URL = "https://coperoanalise.com";

Then(
  "the page exposes a title, description, and sharing image",
  async ({ world }) => {
    await expect(world.page.locator('meta[property="og:title"]')).toHaveAttribute(
      "content",
      /Copero Analysis/,
    );
    await expect(
      world.page.locator('meta[property="og:description"]'),
    ).toHaveAttribute("content", /\S+/);
    await expect(world.page.locator('meta[property="og:image"]')).toHaveAttribute(
      "content",
      /logo\.png$/,
    );
  },
);

Then("the canonical URL points to the official domain", async ({ world }) => {
  await expect(world.page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    SITE_URL,
  );
});

Then("robots.txt responds with a link to the sitemap", async ({ world }) => {
  const response = await world.page.request.get("/robots.txt");
  expect(response.status()).toBe(200);
  expect(await response.text()).toContain(`Sitemap: ${SITE_URL}/sitemap.xml`);
});

Then("the sitemap lists the public pages", async ({ world }) => {
  const response = await world.page.request.get("/sitemap.xml");
  expect(response.status()).toBe(200);
  const body = await response.text();
  expect(body).toContain(`<loc>${SITE_URL}/</loc>`);
  expect(body).toContain(`<loc>${SITE_URL}/what-is-copero</loc>`);
  expect(body).toContain(`<loc>${SITE_URL}/about-us</loc>`);
});

Then("the notice page requests not to be indexed", async ({ world }) => {
  await expect(world.page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    /noindex/,
  );
});
