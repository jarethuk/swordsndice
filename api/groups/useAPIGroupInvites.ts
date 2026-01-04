import { FIVE_MINUTES } from '../../constants/Time';
import { usePersistedQuery } from '../../hooks/usePersistedQuery';
import type { UserGroupInvite } from '../../types/api/responses/UserGroupInvite';
import { API } from '../API';

export function useAPIGroupInvites() {
  return usePersistedQuery<UserGroupInvite[]>({
    queryKey: ['group-invites'],
    queryFn: () => API.get<UserGroupInvite[]>('/api/groups/invites'),
    staleTime: FIVE_MINUTES,
  });
}
