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
      title: "Probable lineup",
      body: "Adversary FC are likely to keep the same core lineup, stretching play out wide and using two holding midfielders to protect the edge of the box.",
      incidences: [
        "lineup: same core lineup in recent sample matches",
        "in possession: fullbacks provide width and push back the opposing line",
      ],
    },
    {
      id: "watch-out",
      title: "Watch out, Team PA!",
      body: "Adversary FC often build short and accelerate when they find their midfielder between the lines. If Team PA press high without cover, a pass in behind the fullback becomes their shortcut.",
      incidences: [
        "attacking transition: two goals after a high regain",
        "in possession: key passes per match above the recent sample average",
      ],
    },
    {
      id: "path",
      title: "The path to victory",
      body: "The match may be decided by the second ball after a cross. Winning that rebound is what turns pressure into a clear chance.\n\nIf Player 10 receives facing forward, Team PA can find a shot or a final pass before the visitors’ defensive block resets.",
      incidences: [
        "out of possession: allowed 12.4 shots per match",
        "set pieces: conceded six shots from 24 corners",
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
      return json(response, 404, { error: "not found" });
    }
    const talk = talks.get(url.searchParams.get("slug") ?? "");
    return talk ? json(response, 200, talk) : json(response, 404, { error: "not found" });
  }

  if (request.method === "GET" && url.pathname === "/api/matches/next/public") {
    if (!prelecaoPublicaEnabled && !hasPrelecaoOverride(request)) {
      return json(response, 404, { error: "not found" });
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

  return json(response, 404, { error: "route not found" });
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
