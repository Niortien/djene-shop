import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ApiUser, AuthResponse } from "@/types";
import * as api from "@/lib/api";

interface AuthStore {
  user: ApiUser | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;

  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone?: string;
  }) => Promise<void>;
  requestOtp: (phone: string) => Promise<void>;
  verifyOtp: (phone: string, otp: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

function applyAuth(set: (s: Partial<AuthStore>) => void, res: AuthResponse) {
  set({ user: res.user, token: res.token, isLoading: false, error: null });
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const res = await api.login(email, password);
          applyAuth(set, res);
        } catch (err) {
          set({ isLoading: false, error: (err as Error).message });
          throw err;
        }
      },

      register: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const res = await api.register(data);
          applyAuth(set, res);
        } catch (err) {
          set({ isLoading: false, error: (err as Error).message });
          throw err;
        }
      },

      requestOtp: async (phone) => {
        set({ isLoading: true, error: null });
        try {
          await api.requestOtp(phone);
          set({ isLoading: false });
        } catch (err) {
          set({ isLoading: false, error: (err as Error).message });
          throw err;
        }
      },

      verifyOtp: async (phone, otp) => {
        set({ isLoading: true, error: null });
        try {
          const res = await api.verifyOtp(phone, otp);
          applyAuth(set, res);
        } catch (err) {
          set({ isLoading: false, error: (err as Error).message });
          throw err;
        }
      },

      logout: () => set({ user: null, token: null, error: null }),
      clearError: () => set({ error: null }),
    }),
    { name: "djene-auth", partialize: (s) => ({ user: s.user, token: s.token }) }
  )
);
