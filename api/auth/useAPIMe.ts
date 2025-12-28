import { FIVE_MINUTES } from '../../constants/Time';
import { usePersistedQuery } from '../../hooks/usePersistedQuery';
import type { UserResponse } from '../../types/api/responses/UserResponse';
import { API } from '../API';

export function useAPIMe(options?: { enabled?: boolean }) {
  return usePersistedQuery<UserResponse | false>({
    queryKey: ['me'],
    queryFn: () => API.get<UserResponse | false>('/api/auth/me'),
    staleTime: FIVE_MINUTES,
    ...options,
  });
}
