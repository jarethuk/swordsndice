import { useQuery } from '@tanstack/react-query';
import { API } from '../API';

export function useAPILogout() {
  return useQuery<boolean>({
    queryKey: ['logout'],
    queryFn: () => API.get<boolean>('/api/auth/logout'),
    enabled: false,
  });
}
