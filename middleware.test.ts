import { NextRequest } from "next/server";
import { expect, test } from "vitest";
import { middleware } from "./middleware";

const PHONE_UA =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1";
const DESKTOP_UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15";

function requestFor(path: string, userAgent: string | null) {
  const headers = new Headers();
  if (userAgent) headers.set("user-agent", userAgent);
  return new NextRequest(new URL(path, "https://copero.app"), { headers });
}

test("a real phone passes through untouched", () => {
  const response = middleware(requestFor("/", PHONE_UA));
  expect(response.headers.get("x-middleware-rewrite")).toBeNull();
});

test.each([
  "facebookexternalhit/1.1",
  "Twitterbot/1.0",
  "WhatsApp/2.23.20",
  "LinkedInBot/1.0",
  "Slackbot-LinkExpanding 1.0",
  "TelegramBot (like TwitterBot)",
  "Discordbot/2.0",
  "redditbot/1.0",
])("social crawler %s passes through for link preview", (userAgent) => {
  const response = middleware(requestFor("/prelecao/2026-brasileirao-fase-unica-15-bahia", userAgent));
  expect(response.headers.get("x-middleware-rewrite")).toBeNull();
});

test("a desktop is rewritten to the notice page", () => {
  const response = middleware(requestFor("/", DESKTOP_UA));
  expect(response.headers.get("x-middleware-rewrite")).toBe("https://copero.app/apenas-no-celular");
});

test("a desktop is rewritten from any path, not just the root", () => {
  const response = middleware(requestFor("/o-que-e", DESKTOP_UA));
  expect(response.headers.get("x-middleware-rewrite")).toBe("https://copero.app/apenas-no-celular");
});

test("already on the notice page, a desktop is not rewritten again", () => {
  const response = middleware(requestFor("/apenas-no-celular", DESKTOP_UA));
  expect(response.headers.get("x-middleware-rewrite")).toBeNull();
});

test("missing user agent is still rewritten to the notice page", () => {
  const response = middleware(requestFor("/", null));
  expect(response.headers.get("x-middleware-rewrite")).toBe("https://copero.app/apenas-no-celular");
});
