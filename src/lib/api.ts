// Same-origin API client — admin app is served at /admin behind nginx; the backend is /v1
// on the same host, so relative URLs work without CORS.
import { clearSession, getToken } from "./auth";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

async function request<T>(path: string, method: "GET" | "POST", body?: unknown): Promise<T> {
  const token = getToken();
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });
  if (res.status === 401) {
    clearSession();
    throw new Error("Session expired — sign in again.");
  }
  if (!res.ok) {
    let message = `${res.status} ${res.statusText}`;
    try {
      const b = await res.json();
      if (b?.message) message = b.message;
    } catch {
      /* ignore */
    }
    throw new Error(message);
  }
  return (await res.json()) as T;
}

export const apiGet = <T>(path: string) => request<T>(path, "GET");
export const apiPost = <T>(path: string, body?: unknown) => request<T>(path, "POST", body);
