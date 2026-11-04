# Build context: frontend/app/ (one BC = one bootstrap unit).
FROM node:20-alpine AS builder
WORKDIR /src
COPY package.json package-lock.json ./
# #20 (incidente 2026-07-14): pre-commit já roda tsc/eslint/testes antes de
# qualquer coisa chegar aqui — typescript/eslint/vitest/playwright são só
# devDependencies, nenhum é usado no build de produção (typescript/eslint
# ignorados via next.config.mjs). --omit=dev: 583 → 106 pacotes, é o que
# resolve o OOM do kaniko de verdade (menos raiz de árvore de arquivo pra
# snapshotar), não só sintoma.
RUN npm ci --omit=dev --no-audit --no-fund
COPY . .
# #20: NEXT_PUBLIC_* is inlined into the browser bundle at build time, not
# read from the pod's runtime env — must arrive as a build arg. DSN isn't a
# secret (safe to expose client-side by Sentry's own design), so it's a
# plain build-arg, not a Sealed Secret (see .ci/pipeline/build.yml).
ARG NEXT_PUBLIC_SENTRY_DSN_APP
ENV NEXT_PUBLIC_SENTRY_DSN_APP=$NEXT_PUBLIC_SENTRY_DSN_APP
# AdSense ids ship in the page source by design (client/slot are public) —
# plain build args, same pattern as the DSN. Unset (pre-approval) the slot
# renders its empty state instead of loading the script.
ARG NEXT_PUBLIC_ADSENSE_CLIENT
ENV NEXT_PUBLIC_ADSENSE_CLIENT=$NEXT_PUBLIC_ADSENSE_CLIENT
ARG NEXT_PUBLIC_ADSENSE_SLOT
ENV NEXT_PUBLIC_ADSENSE_SLOT=$NEXT_PUBLIC_ADSENSE_SLOT
ARG NEXT_PUBLIC_ADSENSE_PUBLISHER_ID
ENV NEXT_PUBLIC_ADSENSE_PUBLISHER_ID=$NEXT_PUBLIC_ADSENSE_PUBLISHER_ID
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
# #45: uid/gid numéricos fixos (1001). runAsNonRoot no k8s exige um uid
# numérico — com USER nomeado o kubelet não consegue provar que não é root e
# recusa o container. Fixar aqui mantém a posse dos arquivos (chown abaixo)
# alinhada ao runAsUser: 1001 do deployment.
RUN addgroup -g 1001 -S nodejs && adduser -u 1001 -S nextjs -G nodejs
COPY --from=builder /src/public ./public
COPY --from=builder --chown=nextjs:nodejs /src/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /src/.next/static ./.next/static
USER 1001
EXPOSE 3000
ENV PORT=3000
CMD ["node", "server.js"]
