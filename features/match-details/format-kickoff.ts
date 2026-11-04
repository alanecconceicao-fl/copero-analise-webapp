const SaoPauloTimeZone = "America/Sao_Paulo";

export function formatKickoff(kickoffUTC: string): string {
  const date = new Date(kickoffUTC);
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: SaoPauloTimeZone,
  }).format(date);
}
