import { ONE_DAY } from '../../constants/Time';
import { usePersistedQuery } from '../../hooks/usePersistedQuery';
import type { PublicUser } from '../../types/api/responses/PublicUser';
import { API } from '../API';

export function useAPIFriends() {
	return usePersistedQuery<PublicUser[]>({
		queryKey: ['friends'],
		queryFn: () => API.get<PublicUser[]>('/api/friends'),
		staleTime: ONE_DAY,
	});
}
