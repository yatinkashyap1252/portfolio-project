import { create } from "zustand";

interface UserInfo {
  email: string;
  role: string;
  twoFactorEnabled: boolean;
}

interface AuthState {
  accessToken: string | null;
  user: UserInfo | null;
  isAuthenticated: boolean;
  isPending2fa: boolean;
  pending2faToken: string | null;
  loading: boolean;
  setAuth: (accessToken: string, user: UserInfo) => void;
  setPending2fa: (token: string) => void;
  clearAuth: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  isAuthenticated: false,
  isPending2fa: false,
  pending2faToken: null,
  loading: false,

  setAuth: (accessToken, user) =>
    set({
      accessToken,
      user,
      isAuthenticated: true,
      isPending2fa: false,
      pending2faToken: null,
    }),

  setPending2fa: (token) =>
    set({
      accessToken: null,
      user: null,
      isAuthenticated: false,
      isPending2fa: true,
      pending2faToken: token,
    }),

  clearAuth: () =>
    set({
      accessToken: null,
      user: null,
      isAuthenticated: false,
      isPending2fa: false,
      pending2faToken: null,
    }),

  setLoading: (loading) => set({ loading }),
}));
