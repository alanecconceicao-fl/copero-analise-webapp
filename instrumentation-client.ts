import * as Sentry from "@sentry/nextjs";

// NEXT_PUBLIC_SENTRY_DSN_APP (não NEXT_PUBLIC_SENTRY_DSN): mesmo motivo do
// instrumentation.ts — evita colisão de nome com o par SENTRY_DSN/
// NEXT_PUBLIC_SENTRY_DSN de frontend-admin, que aponta pra um projeto
// Sentry diferente (CR finding, 2026-07-14).
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN_APP,
  tracesSampleRate: 1.0,
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
