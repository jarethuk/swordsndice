import { FIVE_MINUTES } from '../../constants/Time';
import { usePersistedQuery } from '../../hooks/usePersistedQuery';
import type { UserGroup } from '../../types/api/responses/UserGroup';
import { API } from '../API';

export function useAPIGroupInvites() {
  return usePersistedQuery<UserGroup[]>({
    queryKey: ['group-invites'],
    queryFn: () => API.get<UserGroup[]>('/api/groups/invites'),
    staleTime: FIVE_MINUTES,
  });
}
