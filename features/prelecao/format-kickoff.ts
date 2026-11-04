const SaoPauloTimeZone = "America/Sao_Paulo";

export function formatKickoff(kickoffUTC: string): string {
  const date = new Date(kickoffUTC);
  const weekday = new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    timeZone: SaoPauloTimeZone,
  }).format(date);
  const day = new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    timeZone: SaoPauloTimeZone,
  }).format(date);
  const month = new Intl.DateTimeFormat("pt-BR", {
    month: "long",
    timeZone: SaoPauloTimeZone,
  }).format(date);
  const time = new Intl.DateTimeFormat("pt-BR", {
    hour: "numeric",
    minute: "2-digit",
    hour12: false,
    timeZone: SaoPauloTimeZone,
  }).format(date).replace(":", "h");

  return `${weekday}, ${day} de ${month}, ${time}`;
}
