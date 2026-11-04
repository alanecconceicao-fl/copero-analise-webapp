"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

// #20: App Router only reports render errors to Sentry when this file
// exists (replaces the root layout when triggered, so it needs its own
// <html>/<body>).
export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="pt-BR">
      <body>
        <p>Algo deu errado. Já fomos notificados.</p>
      </body>
    </html>
  );
}
