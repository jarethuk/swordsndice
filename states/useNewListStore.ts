import {create} from 'zustand';
import {Games} from '../types';

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
	game: Games.MESBG,
	actions: {
		setName: (name) => set({ name }),
		setGame: (game) => set({ game, army: undefined }),
		setArmy: (army) => set({ army }),
		setPoints: (points) => set({ points }),
		reset: () =>
			set({
				name: undefined,
				game: Games.MESBG,
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
