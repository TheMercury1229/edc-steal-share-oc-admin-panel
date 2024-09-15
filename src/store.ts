// store.ts
import { create } from "zustand";

type AuthState = {
  isAuthenticated: boolean;
  adminId: string | null;
  login: (adminId: string) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  adminId: null,
  login: (adminId: string) => set({ isAuthenticated: true, adminId }),
  logout: () => set({ isAuthenticated: false, adminId: null }),
}));
