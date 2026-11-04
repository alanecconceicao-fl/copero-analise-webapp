const DefaultBackendAppUrl = "http://backend-app:8080";
const ReadTimeoutMs = 5_000;
const GenericBackendError = "O serviço está indisponível.";

export async function backendGetJson<T>(path: string, init: { headers?: HeadersInit } = {}): Promise<T | null> {
  try {
    const headers = new Headers(init.headers);
    (await featureFlagOverrideHeaders()).forEach((value, name) => headers.set(name, value));
    const response = await fetch(`${backendAppUrl()}${path}`, {
      cache: "no-store",
      headers,
      signal: AbortSignal.timeout(ReadTimeoutMs),
    });

    if (response.status === 404) {
      return null;
    }
    if (!response.ok) {
      console.error("backend app request failed", { path, status: response.status });
      throw new Error(GenericBackendError);
    }

    return await response.json() as T;
  } catch (error) {
    if (error instanceof Error && error.message === GenericBackendError) {
      throw error;
    }
    console.error("backend app request failed", {
      path,
      error: error instanceof Error ? error.message : String(error),
    });
    throw new Error(GenericBackendError);
  }
}

function backendAppUrl(): string {
  return process.env.BACKEND_APP_URL ?? DefaultBackendAppUrl;
}
import { featureFlagOverrideHeaders } from "./feature-flag-override";
