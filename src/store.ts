import { create } from "zustand";

interface AuthState {
  isAuthenticated: boolean;
  login: (adminId: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: !!localStorage.getItem("token"), // Check for token on init
  login: (adminId: string) => {
    set({ isAuthenticated: true });
    localStorage.setItem("token", adminId); // Save the token (or adminId here for simplicity)
  },
  logout: () => {
    set({ isAuthenticated: false });
    localStorage.removeItem("token"); // Remove the token on logout
  },
}));
