import { useQuery } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { UserResponse } from '../../types/api/responses/UserResponse';
import { API } from '../API';

export function useAPIMe() {
  return useQuery<UserResponse | false, AxiosError>({
    queryKey: ['me'],
    queryFn: () => API.get<UserResponse | false>('/api/auth/me'),
  });
}
