import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { CreateGroupRequest } from '../../types/api/requests/CreateGroupRequest';
import type { IdResponse } from '../../types/api/responses/IdResponse';
import { API } from '../API';

export function useAPICreateGroup() {
  return useMutation<IdResponse, AxiosError, CreateGroupRequest>({
    mutationKey: ['create-group'],
    mutationFn: (request) => API.put<IdResponse>('/api/groups', request),
  });
}
