import { ONE_HOUR } from '../../constants/Time';
import { usePersistedQuery } from '../../hooks/usePersistedQuery';
import type { PublicUserFull } from '../../types/api/responses/PublicUserFull';
import { API } from '../API';

export function useAPIGetUser(username: string) {
	return usePersistedQuery<PublicUserFull>({
		queryKey: ['user', username],
		queryFn: () => API.get<PublicUserFull>(`/api/user/${username}`),
		staleTime: ONE_HOUR,
	});
}
