/**
 * Server-only Rendobar Compose API client.
 *
 * Keep imports of this module on the server. Pass the API key from a protected
 * server environment binding; never import this module into browser components.
 *
 * This is a provider adapter only. It does not upload browser File objects,
 * persist jobs, authenticate users, or debit customer credits.
 */

const API_BASE = "https://api.rendobar.com";

export type ComposeParams = {
  schemaVersion?: number;
  output: {
    format: "mp4";
    resolution?: { width: number; height: number };
    fps?: number;
  };
  timeline: Record<string, unknown>;
};

export type RendobarApiResponse = Record<string, unknown>;

async function requestRendobar(
  apiKey: string,
  path: string,
  init: RequestInit = {},
): Promise<RendobarApiResponse> {
  if (!apiKey.trim()) {
    throw new Error("Rendobar is not configured: missing server API key.");
  }

  const response = await fetch(new URL(path, API_BASE), {
    ...init,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Accept: "application/json",
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...init.headers,
    },
  });

  if (!response.ok) {
    // Do not include response bodies: providers can return request details or
    // user-supplied values that should not be exposed in application errors.
    throw new Error(`Rendobar request failed with HTTP ${response.status}.`);
  }

  const payload: unknown = await response.json();
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw new Error("Rendobar returned an unexpected response format.");
  }

  return payload as RendobarApiResponse;
}

/**
 * Validate a Compose timeline and retrieve the provider's validation/cost
 * response before rendering. Provider validation is documented as free.
 */
export function validateCompose(
  apiKey: string,
  params: ComposeParams,
): Promise<RendobarApiResponse> {
  return requestRendobar(apiKey, "/compose/validate", {
    method: "POST",
    body: JSON.stringify(params),
  });
}

/** Submit a Compose render. Call only after the user approves the estimate. */
export function createComposeJob(
  apiKey: string,
  params: ComposeParams,
): Promise<RendobarApiResponse> {
  return requestRendobar(apiKey, "/jobs", {
    method: "POST",
    body: JSON.stringify({ type: "compose", params }),
  });
}

/** Fetch status for a previously recorded provider job ID. */
export function getComposeJob(
  apiKey: string,
  jobId: string,
): Promise<RendobarApiResponse> {
  if (!/^[A-Za-z0-9_-]{1,200}$/.test(jobId)) {
    throw new Error("Invalid Rendobar job ID.");
  }

  return requestRendobar(apiKey, `/jobs/${encodeURIComponent(jobId)}`);
}
