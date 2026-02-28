import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: number;
  email: string;
  name?: string;
}

interface UserState {
  isLoggedIn: boolean;
  token: string | null;
  user: User | null;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      token: null,
      user: null,
      setAuth: (token, user) => set({ isLoggedIn: true, token, user }),
      logout: () => set({ isLoggedIn: false, token: null, user: null }),
    }),
    {
      name: 'user-storage',
    }
  )
);
