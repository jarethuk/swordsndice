import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { UpdateGroupRequest } from '../../types/api/requests/UpdateGroupRequest';
import type { BasicResponse } from '../../types/api/responses/BasicResponse';
import { API } from '../API';

export function useAPIUpdateGroup(id: string) {
  return useMutation<BasicResponse, AxiosError, UpdateGroupRequest>({
    mutationKey: ['update-group', id],
    mutationFn: (request) => API.patch<BasicResponse>(`/api/groups/${id}`, request),
  });
}
