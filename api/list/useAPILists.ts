import { ONE_HOUR } from '../../constants/Time';
import { usePersistedQuery } from '../../hooks/usePersistedQuery';
import type { ListBody } from '../../types/api/ListBody';
import { API } from '../API';

export function useAPILists() {
  return usePersistedQuery<ListBody[]>({
    queryKey: ['lists'],
    queryFn: () => API.get<ListBody[]>('/api/lists'),
    staleTime: ONE_HOUR,
  });
}
