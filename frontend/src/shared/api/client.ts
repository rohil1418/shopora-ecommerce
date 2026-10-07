const BASE_URL: string = import.meta.env.VITE_API_URL || "/api";

export class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

type RequestOptions = Omit<RequestInit, "body"> & { body?: unknown };

export async function apiFetch<T>(
  path: string,
  { body, headers, ...options }: RequestOptions = {}
): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    credentials: "include",
    ...options,
    headers: {
      ...(body !== undefined && { "Content-Type": "application/json" }),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(response.status, data?.message ?? "Something went wrong", data?.details);
  }

  return data as T;
}

export const api = {
  get: <T>(path: string) => apiFetch<T>(path),
  post: <T>(path: string, body?: unknown) => apiFetch<T>(path, { method: "POST", body }),
  put: <T>(path: string, body?: unknown) => apiFetch<T>(path, { method: "PUT", body }),
  patch: <T>(path: string, body?: unknown) => apiFetch<T>(path, { method: "PATCH", body }),
  delete: <T>(path: string) => apiFetch<T>(path, { method: "DELETE" }),
};

export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    const details = error.details;
    if (Array.isArray(details) && typeof details[0]?.message === "string") {
      return details[0].message;
    }
    return error.message;
  }
  return "Network error. Please check your connection and try again.";
}