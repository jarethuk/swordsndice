import { ONE_DAY } from '../../constants/Time';
import { usePersistedQuery } from '../../hooks/usePersistedQuery';
import type { GameListResponse } from '../../types/api/responses/GameListResponse';
import { API } from '../API';

export function useAPIGames(state?: 'active' | 'complete') {
	return usePersistedQuery<GameListResponse[]>({
		queryKey: ['games', state],
		queryFn: () =>
			API.get<GameListResponse[]>(
				`/api/games?${state ? `state=${state}` : ''}`,
			),
		staleTime: ONE_DAY,
	});
}
