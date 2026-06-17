import { useAuthStore } from "../store/authStore";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

interface RequestOptions extends RequestInit {
  skipAuth?: boolean;
  skip2faToken?: boolean;
}

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const subscribeTokenRefresh = (cb: (token: string) => void) => {
  refreshSubscribers.push(cb);
};

const onRefreshed = (token: string) => {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
};

export const apiFetch = async (endpoint: string, options: RequestOptions = {}): Promise<any> => {
  const { skipAuth, skip2faToken, ...fetchOptions } = options;
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Set default headers
  const headers = new Headers(fetchOptions.headers || {});
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  // Attach token
  const state = useAuthStore.getState();
  if (!skipAuth && state.accessToken) {
    headers.set("Authorization", `Bearer ${state.accessToken}`);
  } else if (skip2faToken && state.pending2faToken) {
    headers.set("Authorization", `Bearer ${state.pending2faToken}`);
  }

  fetchOptions.headers = headers;
  fetchOptions.credentials = "include"; // crucial for cookie-based refresh tokens

  try {
    const response = await fetch(url, fetchOptions);
    
    // Parse json
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      // If unauthorized (401), try to refresh token
      if (response.status === 401 && !skipAuth && state.accessToken) {
        if (!isRefreshing) {
          isRefreshing = true;
          try {
            const refreshRes = await fetch(`${API_BASE_URL}/auth/refresh`, {
              method: "POST",
              credentials: "include",
            });
            const refreshData = await refreshRes.json();
            
            if (refreshRes.ok && refreshData.accessToken) {
              // Save new credentials
              useAuthStore.getState().setAuth(refreshData.accessToken, state.user || {
                email: "",
                role: "admin",
                twoFactorEnabled: false,
              });
              onRefreshed(refreshData.accessToken);
              isRefreshing = false;

              // Retry original request with new token
              const newHeaders = new Headers(headers);
              newHeaders.set("Authorization", `Bearer ${refreshData.accessToken}`);
              return fetch(url, { ...fetchOptions, headers: newHeaders }).then((r) => r.json());
            } else {
              // Refresh failed
              useAuthStore.getState().clearAuth();
              isRefreshing = false;
              if (typeof window !== "undefined") {
                window.location.href = "/login";
              }
              throw new Error("Session expired. Please log in again.");
            }
          } catch (refreshErr) {
            useAuthStore.getState().clearAuth();
            isRefreshing = false;
            if (typeof window !== "undefined") {
              window.location.href = "/login";
            }
            throw refreshErr;
          }
        } else {
          // If already refreshing, wait for it to complete
          return new Promise((resolve) => {
            subscribeTokenRefresh((newToken) => {
              const newHeaders = new Headers(headers);
              newHeaders.set("Authorization", `Bearer ${newToken}`);
              resolve(fetch(url, { ...fetchOptions, headers: newHeaders }).then((r) => r.json()));
            });
          });
        }
      }
      
      const errMsg = data.message || `HTTP error! status: ${response.status}`;
      const err = new Error(errMsg) as any;
      err.status = response.status;
      err.data = data;
      throw err;
    }

    return data;
  } catch (err: any) {
    throw err;
  }
};
