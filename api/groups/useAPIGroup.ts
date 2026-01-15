import { ONE_HOUR } from '../../constants/Time';
import { usePersistedQuery } from '../../hooks/usePersistedQuery';
import type { GroupResponse } from '../../types/api/responses/GroupResponse';
import { API } from '../API';

export function useAPIGroup(id: string) {
	return usePersistedQuery<GroupResponse>({
		queryKey: ['group', id],
		queryFn: () => API.get<GroupResponse>(`/api/groups/${id}`),
		staleTime: ONE_HOUR,
	});
}
