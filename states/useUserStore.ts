import { create } from 'zustand';
import type { UserResponse } from '../types/api/responses/UserResponse';

export interface UserStore {
  user?: UserResponse;
  actions: {
    setUser: (user?: UserResponse) => void;
  };
}

const useUserStore = create<UserStore>((set) => ({
  actions: {
    setUser: (user?: UserResponse) => set({ user }),
  },
}));

export const useUser = () => useUserStore((x) => x.user);

export const useUserActions = () => useUserStore((x) => x.actions);
