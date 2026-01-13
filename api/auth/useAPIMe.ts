import { useQuery } from '@tanstack/react-query';
import type { UserResponse } from '../../types/api/responses/UserResponse';
import { API } from '../API';

export function useAPIMe(options?: { enabled?: boolean }) {
  return useQuery<UserResponse | false>({
    queryKey: ['me'],
    queryFn: () => API.get<UserResponse | false>('/api/auth/me'),
    ...options,
  });
}
