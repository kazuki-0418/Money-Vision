import { create } from "zustand";

type User = {
  id: string;
  username: string;
  email: string;
} | null;

type UserStore = {
  user: User;
  setUser: (userData: User) => void;
};

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (userData) => set({ user: userData }),
}));
