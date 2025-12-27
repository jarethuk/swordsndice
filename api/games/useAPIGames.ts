import { ONE_DAY } from '../../constants/Time';
import { usePersistedQuery } from '../../hooks/usePersistedQuery';
import type { GameResponse } from '../../types/api/responses/GameResponse';
import { API } from '../API';

export function useAPIGames() {
  return usePersistedQuery<GameResponse[]>({
    queryKey: ['games'],
    queryFn: () => API.get<GameResponse[]>('/api/games'),
    staleTime: ONE_DAY,
  });
}
