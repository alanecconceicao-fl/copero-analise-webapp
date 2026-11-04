// Access rule of the public BC: only real mobile phones get in (AC 1).
// Device is decided by what it IS (user agent), never by window size —
// a narrow desktop window is still a desktop.
//
// Heuristic: explicit tablet tokens lose first (legacy iPad UAs carry
// "Mobile", so the tablet check must run before the mobile one); then any
// "Mobi" token (Android phones, iPhone) wins.
const TABLET = /iPad|Tablet/i;
const MOBILE = /Mobi/i;
const SOCIAL_CRAWLERS = [
  /facebookexternalhit/i,
  /Twitterbot/i,
  /WhatsApp/i,
  /LinkedInBot/i,
  /Slackbot/i,
  /TelegramBot/i,
  /Discordbot/i,
  /redditbot/i,
];

export function isRealMobilePhone(userAgent: string | null): boolean {
  if (!userAgent) return false;
  if (TABLET.test(userAgent)) return false;
  return MOBILE.test(userAgent);
}

export function isSocialCrawler(userAgent: string | null): boolean {
  if (!userAgent) return false;
  return SOCIAL_CRAWLERS.some((crawler) => crawler.test(userAgent));
}
