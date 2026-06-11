const API_BASE_URL = "http://localhost:5000/api";

export async function apiGet<T>(path: string, params?: Record<string, string | number | boolean | undefined>) {
  const query = new URLSearchParams();
  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== "") query.set(key, String(value));
  });

  const response = await fetch(`${API_BASE_URL}${path}${query.size ? `?${query.toString()}` : ""}`);
  if (!response.ok) throw new Error(`API request failed: ${response.status}`);
  return (await response.json()) as T;
}

export const apiBaseUrl = API_BASE_URL;
