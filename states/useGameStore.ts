import {create} from 'zustand';
import {getDBGame, updateDBGame} from '../db/DBGames';
import type {Game} from '../types/Game';

export interface GameStore {
	game?: Game | null;
	actions: {
		setGame: (game?: Game | null) => void;
		updateGame: (update: Partial<Game>) => Promise<void>;
	};
}

const useGameStore = create<GameStore>((set, get) => ({
	actions: {
		setGame: (game) => set({ game }),
		updateGame: async (update: Partial<Game>) => {
			const { game } = get();

			if (game) {
				await updateDBGame(game.id, update);

				const dbGame = await getDBGame(game.id);

				if (dbGame) {
					set({ game: dbGame });
				}
			}
		},
	},
}));

export const useGame = () => useGameStore((x) => x.game);

export const useGameActions = () => useGameStore((x) => x.actions);
