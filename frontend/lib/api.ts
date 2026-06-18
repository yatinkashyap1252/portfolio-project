const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

/**
 * Public client-side API fetch helper for the portfolio website.
 * If backend server is offline or fails, returns null so the client falls back to static mock data.
 */
export async function fetchAPI<T>(endpoint: string): Promise<T | null> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "GET",
      cache: "no-store",
      // Fast timeout if server is completely offline (prevent long blank loading screens)
      signal: AbortSignal.timeout(4000), 
    });

    if (!response.ok) {
      console.warn(`API query to ${endpoint} returned status: ${response.status}`);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.warn(`API query to ${endpoint} failed (backend server may be offline). Falling back to mock data.`, error);
    return null;
  }
}
