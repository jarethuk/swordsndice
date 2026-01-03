import { FIVE_MINUTES } from '../../constants/Time';
import { usePersistedQuery } from '../../hooks/usePersistedQuery';
import type { GameInviteResponse } from '../../types/api/responses/GameInviteResponse';
import { API } from '../API';

export function useAPIGameInvites() {
  return usePersistedQuery<GameInviteResponse[]>({
    queryKey: ['game-invites'],
    queryFn: () => API.get<GameInviteResponse[]>(`/api/games/invites`),
    staleTime: FIVE_MINUTES,
  });
}
