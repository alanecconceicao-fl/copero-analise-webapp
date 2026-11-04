import { expect, test } from "vitest";
import { isRealMobilePhone, isSocialCrawler } from "./device";

const UA = {
  iphone:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1",
  androidPhone:
    "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0 Mobile Safari/537.36",
  androidTablet:
    "Mozilla/5.0 (Linux; Android 14; SM-X710) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0 Safari/537.36",
  legacyIpad:
    "Mozilla/5.0 (iPad; CPU OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1",
  macDesktop:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15",
  windowsDesktop:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0 Safari/537.36",
};

test("iPhone gets in", () => {
  expect(isRealMobilePhone(UA.iphone)).toBe(true);
});

test("Android phone gets in", () => {
  expect(isRealMobilePhone(UA.androidPhone)).toBe(true);
});

test("Android tablet is blocked", () => {
  expect(isRealMobilePhone(UA.androidTablet)).toBe(false);
});

test("legacy iPad (carries Mobile token) is still blocked", () => {
  expect(isRealMobilePhone(UA.legacyIpad)).toBe(false);
});

test("desktops are blocked", () => {
  expect(isRealMobilePhone(UA.macDesktop)).toBe(false);
  expect(isRealMobilePhone(UA.windowsDesktop)).toBe(false);
});

test("missing user agent is blocked", () => {
  expect(isRealMobilePhone(null)).toBe(false);
  expect(isRealMobilePhone("")).toBe(false);
});

test.each([
  ["Facebook", "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)"],
  ["X", "Twitterbot/1.0"],
  ["WhatsApp", "WhatsApp/2.23.20"],
  ["LinkedIn", "LinkedInBot/1.0"],
  ["Slack", "Slackbot-LinkExpanding 1.0 (+https://api.slack.com/robots)"],
  ["Telegram", "TelegramBot (like TwitterBot)"],
  ["Discord", "Mozilla/5.0 (compatible; Discordbot/2.0; +https://discordapp.com)"],
  ["Reddit", "redditbot/1.0"],
])("%s crawler is allowed to preview links", (_, userAgent) => {
  expect(isSocialCrawler(userAgent)).toBe(true);
});

test("common readers are not social crawlers", () => {
  expect(isSocialCrawler(UA.iphone)).toBe(false);
  expect(isSocialCrawler(UA.macDesktop)).toBe(false);
  expect(isSocialCrawler(null)).toBe(false);
  expect(isSocialCrawler("")).toBe(false);
});
