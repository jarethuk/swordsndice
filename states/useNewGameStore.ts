import { create } from 'zustand';
import type { Games } from '../types';
import type { ListBody } from '../types/api/ListBody';

export interface NewGameStore {
	list?: ListBody;
	game?: Games;
	points?: string;
	actions: {
		setList: (list?: ListBody) => void;
		setGame: (game?: Games) => void;
		setPoints: (points?: string) => void;
		reset: () => void;
	};
}

const useNewGameStore = create<NewGameStore>((set) => ({
	actions: {
		setList: (list?: ListBody) => set({ list }),
		setGame: (game?: Games) => set({ game }),
		setPoints: (points?: string) => set({ points }),
		reset: () =>
			set({
				list: undefined,
				game: undefined,
				points: undefined,
			}),
	},
}));

export const useNewGameList = () => useNewGameStore((x) => x.list);
export const useNewGameGame = () => useNewGameStore((x) => x.game);
export const useNewGamePoints = () => useNewGameStore((x) => x.points);

export const useNewGameActions = () => useNewGameStore((x) => x.actions);
