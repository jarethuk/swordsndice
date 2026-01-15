import { ONE_HOUR } from '../../constants/Time';
import { usePersistedQuery } from '../../hooks/usePersistedQuery';
import type { FeedItem } from '../../types/api/responses/FeedItem';
import { API } from '../API';

export function useAPIFeed() {
  return usePersistedQuery<FeedItem[]>({
    queryKey: ['feed'],
    queryFn: () => API.get<FeedItem[]>('/api/feed'),
    staleTime: ONE_HOUR,
  });
}
