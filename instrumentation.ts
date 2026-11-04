import * as Sentry from "@sentry/nextjs";

// #20: Node.js/edge-runtime Sentry init. Projeto Sentry próprio (separado
// de frontend-admin/backend-admin) — app pública, sem relação de chamada
// com o backend interno.
//
// SENTRY_DSN_APP (não SENTRY_DSN): CR finding (2026-07-14) — frontend-admin
// já usa SENTRY_DSN pro projeto compartilhado com backend-admin, e as duas
// vars precisam valer coisas DIFERENTES (2 projetos Sentry distintos, ver
// _docs/arquitetura.md §7 Observability). Variável de CI/CD do GitLab é
// plana por projeto (monorepo sem BC-scoping nativo) e a env do pod é só
// um `value:` no deployment.yaml — nome igual pra valor diferente é
// convite a alguém configurar a mesma DSN nos dois por engano.
export function register() {
  Sentry.init({
    dsn: process.env.SENTRY_DSN_APP,
    // #20 CR finding (2026-07-14): probes hit `/` every 10s/15s — a flat
    // tracesSampleRate would trace every one, burning the free-tier budget
    // on pure probe traffic. kubelet always sends User-Agent: kube-probe/*.
    tracesSampler: (samplingContext) => {
      const userAgent = samplingContext.normalizedRequest?.headers?.["user-agent"] ?? "";
      if (userAgent.startsWith("kube-probe")) return 0;
      return 1.0;
    },
  });
}

export const onRequestError = Sentry.captureRequestError;
