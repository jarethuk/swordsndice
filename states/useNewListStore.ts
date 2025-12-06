import {create} from 'zustand';
import type {Games} from '../types';

export interface NewListStore {
	name?: string;
	game?: Games;
	army?: string;
	points?: string;
	actions: {
		setName: (name: string) => void;
		setGame: (game: Games) => void;
		setArmy: (army: string) => void;
		setPoints: (points: string) => void;
		reset: () => void;
	};
}

const useNewListStore = create<NewListStore>((set) => ({
	actions: {
		setName: (name) => set({ name }),
		setGame: (game) => set({ game }),
		setArmy: (army) => set({ army }),
		setPoints: (points) => set({ points }),
		reset: () =>
			set({
				name: undefined,
				game: undefined,
				army: undefined,
				points: undefined,
			}),
	},
}));

export const useNewListName = () => useNewListStore((x) => x.name);
export const useNewListGame = () => useNewListStore((x) => x.game);
export const useNewListArmy = () => useNewListStore((x) => x.army);
export const useNewListPoints = () => useNewListStore((x) => x.points);

export const useNewListActions = () => useNewListStore((x) => x.actions);
