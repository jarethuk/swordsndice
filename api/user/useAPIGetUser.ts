import { ONE_HOUR } from '../../constants/Time';
import { usePersistedQuery } from '../../hooks/usePersistedQuery';
import type { PublicUser } from '../../types/api/responses/PublicUser';
import { API } from '../API';

export function useAPIGetUser(username: string) {
  return usePersistedQuery<PublicUser>({
    queryKey: ['user', username],
    queryFn: () => API.get<PublicUser>(`/api/user/${username}`),
    staleTime: ONE_HOUR,
  });
}
