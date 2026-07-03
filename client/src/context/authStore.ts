import { create } from 'zustand';
import type { User } from '../types/user.types';
import * as authService from '../services/authService';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  register: (name: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  register: async (name, email, password) => {
    const data = await authService.registerUser({ name, email, password });
    localStorage.setItem('token', data.token);
    set({ user: data.user, isAuthenticated: true });
  },

  login: async (email, password) => {
    const data = await authService.loginUser({ email, password });
    localStorage.setItem('token', data.token);
    set({ user: data.user, isAuthenticated: true });
  },

  logout: async () => {
    localStorage.removeItem('token');
    set({ user: null, isAuthenticated: false });
  },

  checkAuth: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      set({ user: null, isAuthenticated: false, isLoading: false });
      return;
    }
    try {
      const data = await authService.getCurrentUser();
      set({ user: data.user, isAuthenticated: true, isLoading: false });
    } catch {
      localStorage.removeItem('token');
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },
}));