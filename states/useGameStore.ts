import { create } from 'zustand';
import { apiUpdateGame } from '../api/games/useAPIUpdateGame';
import type { UpdateGameRequest } from '../types/api/requests/UpdateGameRequest';
import type { GameResponse } from '../types/api/responses/GameResponse';

export interface GameStore {
  game?: GameResponse | null;
  actions: {
    setGame: (game?: GameResponse | null) => void;
    updateGame: (update: UpdateGameRequest) => Promise<void>;
  };
}

const useGameStore = create<GameStore>((set, get) => ({
  actions: {
    setGame: (game) => set({ game }),
    updateGame: async (update: UpdateGameRequest) => {
      const { game } = get();

      if (game) {
        await apiUpdateGame(game.id, update);

        set({
          game: {
            ...game,
            ...update,
          },
        });
      }
    },
  },
}));

export const useGame = () => useGameStore((x) => x.game);

export const useGameActions = () => useGameStore((x) => x.actions);
