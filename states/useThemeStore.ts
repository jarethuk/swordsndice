import { create } from 'zustand';
import type { UserResponse } from '../types/api/responses/UserResponse';

export interface ThemeStore {
	theme?: 'light' | 'dark';
	actions: {
		setTheme: (theme: 'light' | 'dark') => void;
	};
}

const useThemeStore = create<ThemeStore>((set) => ({
	actions: {
		setTheme: (theme) => set({ theme }),
	},
}));

export const useTheme = () => useThemeStore((x) => x.theme);

export const useThemeActions = () => useThemeStore((x) => x.actions);
