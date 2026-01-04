import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { BasicResponse } from '../../types/api/responses/BasicResponse';
import { API } from '../API';

export function useAPIRemoveMemberFromGroup(id: string) {
  return useMutation<BasicResponse, AxiosError, string>({
    mutationKey: ['remove-from-group', id],
    mutationFn: (memberId) => API.delete<BasicResponse>(`/api/groups/${id}/member/${memberId}`),
  });
}
