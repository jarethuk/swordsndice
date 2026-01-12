import { ONE_DAY } from '../../constants/Time';
import { usePersistedQuery } from '../../hooks/usePersistedQuery';
import type { GameListResponse } from '../../types/api/responses/GameListResponse';
import { API } from '../API';

export function useAPIGames() {
  return usePersistedQuery<GameListResponse[]>({
    queryKey: ['games'],
    queryFn: () => API.get<GameListResponse[]>('/api/games'),
    staleTime: ONE_DAY,
  });
}
