import { FIVE_MINUTES } from '../../constants/Time';
import { usePersistedQuery } from '../../hooks/usePersistedQuery';
import type { GameResponse } from '../../types/api/responses/GameResponse';
import { API } from '../API';

export function useAPIGame(id: string) {
	return usePersistedQuery<GameResponse>({
		queryKey: ['game', id],
		queryFn: () => API.get<GameResponse>(`/api/games/${id}`),
		staleTime: FIVE_MINUTES,
	});
}
