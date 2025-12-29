import { useQuery } from '@tanstack/react-query';
import type { GroupSearchResult } from '../../types/api/responses/GroupSearchResult';
import { API } from '../API';

export function useAPIFindGroup(search: string, page = 1) {
  return useQuery<GroupSearchResult[]>({
    queryKey: ['find-group', search, page],
    queryFn: () => API.get<GroupSearchResult[]>(`/api/groups/find?search=${search}&page=${page}`),
    enabled: !!search,
  });
}
