import {create} from 'zustand';
import type {User} from '../types/User';

export interface UserStore {
	user?: User;
	actions: {
		setUser: (user?: User) => void;
	};
}

const useUserStore = create<UserStore>((set) => ({
	user: {
		id: '1',
		username: 'jarethuk',
	},
	actions: {
		setUser: (user?: User) => set({ user }),
	},
}));

export const useUser = () => useUserStore((x) => x.user);

export const useUserActions = () => useUserStore((x) => x.actions);
