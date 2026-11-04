import http from "node:http";

const port = Number(process.env.STUB_BACKEND_PORT ?? 3199);
let prelecaoPublicaEnabled = true;
const bahiaCrest = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg viewBox="314.1999816894531 406.79998779296875 114.39999389648438 148.89996337890625" width="114.39999389648438" height="148.89996337890625" xmlns="http://www.w3.org/2000/svg"><path d="M403.7,416.3c0-1.2,0.1-2.3,0.3-3.4l-32.7-6.1l-32.7,6.1c0.2,1.1,0.3,2.2,0.3,3.4c0,13.7-11.1,24.7-24.7,24.8&#10;&#9;&#9;c0,2.8,0,5.5,0,8.3c0,80.2,57.2,106.3,57.2,106.3s57.2-26.1,57.2-106.3c0-2.7,0-5.5,0-8.3C414.8,441,403.7,429.9,403.7,416.3z&#10;&#9;&#9; M419.2,449.3c0,30.6-8.7,56.4-25.8,76.5c-8.6,10.1-17.3,16.3-22.2,19.2V416.2l23.5,4.4c1.7,13.6,11.5,24.7,24.4,28.4V449.3z" transform="matrix(1, 0, 0, 1, 0, 0)" style="fill: rgb(204, 204, 204); opacity: 1;"/></svg>
`)}`;
const samplePrelecao = {
  slug: "2026-brazilian-championship-single-round-15-adversary-fc",
  match: {
    season: "2026",
    competition: "Brazilian Championship",
    phase: "Single Round",
    round: "15",
    opponent: "Adversary FC",
  },
  kickoffUtc: "2026-08-09T00:30:00Z",
  stadium: "Porto Alegre Stadium",
  stadiumCity: "Porto Alegre",
  stadiumCountry: "Brazil",
  opponentCrestUrl: bahiaCrest,
  home: true,
  deliveredAt: "2026-08-08T12:00:00Z",
  sections: [
    {
      id: "likely-lineup",
      title: "Provável escalação",
      body: "O Adversary FC deve repetir a base que dá amplitude pelos lados e usa dois volantes protegendo a entrada da área.",
      incidences: [
        "escalação: base repetida nas últimas partidas da amostra",
        "em posse: laterais dão amplitude e empurram a linha adversária",
      ],
    },
    {
      id: "watch-out",
      title: "Abre o olho, Grêmio!",
      body: "O Adversary FC costuma sair curto e acelerar quando encontra o meia entrelinhas. Se o Tricolor morder alto sem cobertura, a bola nas costas do lateral vira o atalho deles.",
      incidences: [
        "transição ofensiva: dois gols após recuperação alta",
        "em posse: média de passes-chave acima da amostra recente",
      ],
    },
    {
      id: "path",
      title: "O caminho das pedras",
      body: "O jogo tende a passar pela segunda bola depois do cruzamento. Ganhar esse rebote é o que separa volume de chance clara.\n\nSe Player 10 receber de frente, o Grêmio encontra chute e último passe antes do bloco visitante se recompor.",
      incidences: [
        "sem posse: sofreu 12,4 finalizações por jogo",
        "bola parada: cedeu seis finalizações em 24 escanteios",
      ],
    },
  ],
  lineup: {
    formation: "4-2-3-1",
    headCoach: "Head Coach Guy",
    primaryColor: "#5aa7ff",
    secondaryColor: "#111827",
    players: [
      player("Goalkeeper", 22, "G", 4, 50),
      player("Right Back", 2, "LD", 22, 82),
      player("Center Back 1", 4, "Z", 18, 62),
      player("Center Back 2", 33, "Z", 18, 38),
      player("Left Back", 46, "LE", 24, 18),
      player("Central Midfielder 1", 19, "V", 46, 42),
      player("Central Midfielder 2", 6, "V", 50, 56),
      player("Attacker Midfielder", 10, "M", 68, 48),
      player("Winger 1", 7, "A", 78, 78),
      player("Winger 2", 8, "A", 80, 22),
      player("Striker", 9, "A", 92, 50),
    ],
  },
};
const talks = new Map([
  [samplePrelecao.slug, samplePrelecao],
  ["2026-brazilian-championship-single-round-15-adversary-fc-old", samplePrelecao],
]);

const server = http.createServer(async (request, response) => {
  const url = new URL(request.url ?? "/", `http://${request.headers.host ?? "localhost"}`);

  if (request.method === "GET" && url.pathname === "/healthz") {
    return json(response, 200, { ok: true });
  }

  if (request.method === "GET" && url.pathname === "/api/feature-flags/prelecao-publica") {
    return json(response, 200, {
      name: "FEATURE_PRELECAO_PUBLICA",
      enabled: prelecaoPublicaEnabled || hasPrelecaoOverride(request),
    });
  }

  if (request.method === "PUT" && url.pathname === "/__test__/feature-flags/prelecao-publica") {
    const body = await readJson(request);
    prelecaoPublicaEnabled = body.enabled === true;
    return json(response, 200, { enabled: prelecaoPublicaEnabled });
  }

  if (request.method === "GET" && url.pathname === "/api/matches/team-talk/public") {
    if (!prelecaoPublicaEnabled && !hasPrelecaoOverride(request)) {
      return json(response, 404, { error: "não encontrada" });
    }
    const talk = talks.get(url.searchParams.get("slug") ?? "");
    return talk ? json(response, 200, talk) : json(response, 404, { error: "não encontrada" });
  }

  if (request.method === "GET" && url.pathname === "/api/matches/next/public") {
    if (!prelecaoPublicaEnabled && !hasPrelecaoOverride(request)) {
      return json(response, 404, { error: "não encontrada" });
    }
    return json(response, 200, {
      match: samplePrelecao.match,
      kickoffUtc: samplePrelecao.kickoffUtc,
      stadium: samplePrelecao.stadium,
      stadiumCity: samplePrelecao.stadiumCity,
      stadiumCountry: samplePrelecao.stadiumCountry,
      opponentCrestUrl: samplePrelecao.opponentCrestUrl,
      home: samplePrelecao.home,
      teamTalkSlug: samplePrelecao.slug,
    });
  }

  return json(response, 404, { error: "rota não encontrada" });
});

server.listen(port, "127.0.0.1", () => {
  console.log(`stub-backend listening on ${port}`);
});

function json(response, status, body) {
  response.writeHead(status, { "Content-Type": "application/json" });
  response.end(JSON.stringify(body));
}

function player(name, number, position, x, y) {
  return {
    name,
    number,
    position,
    x,
    y,
  };
}

async function readJson(request) {
  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

function hasPrelecaoOverride(request) {
  return request.headers["x-copero-feature-flag-override"] === "FEATURE_PRELECAO_PUBLICA";
}
