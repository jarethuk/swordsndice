import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { CreateGroupRequest } from '../../types/api/requests/CreateGroupRequest';
import type { BasicResponse } from '../../types/api/responses/BasicResponse';
import { API } from '../API';

export function useAPICreateGroup() {
  return useMutation<BasicResponse, AxiosError, CreateGroupRequest>({
    mutationKey: ['create-group'],
    mutationFn: (request) => API.put<BasicResponse>('/api/groups', request),
  });
}
