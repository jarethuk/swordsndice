import { ONE_HOUR } from '../../constants/Time';
import { usePersistedQuery } from '../../hooks/usePersistedQuery';
import type { ListBody } from '../../types/api/ListBody';
import { API } from '../API';

export function useAPIList(id: string) {
  return usePersistedQuery<ListBody>({
    queryKey: ['list', id],
    queryFn: () => API.get<ListBody>(`/api/lists/${id}`),
    staleTime: ONE_HOUR,
  });
}
