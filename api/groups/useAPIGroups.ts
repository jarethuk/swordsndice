import { ONE_DAY } from '../../constants/Time';
import { usePersistedQuery } from '../../hooks/usePersistedQuery';
import type { UserGroup } from '../../types/api/responses/UserGroup';
import { API } from '../API';

export function useAPIGroups() {
	return usePersistedQuery<UserGroup[]>({
		queryKey: ['groups'],
		queryFn: () => API.get<UserGroup[]>('/api/groups'),
		staleTime: ONE_DAY,
	});
}
