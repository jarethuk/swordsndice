import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { BasicResponse } from '../../types/api/responses/BasicResponse';
import { API } from '../API';

export function useAPIJoinGroup(id: string) {
  return useMutation<BasicResponse, AxiosError>({
    mutationKey: ['join-group', id],
    mutationFn: () => API.patch<BasicResponse>(`/api/groups/${id}/join`, {}),
  });
}
