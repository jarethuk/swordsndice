import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { ListBody } from '../../types/api/ListBody';
import type { BasicResponse } from '../../types/api/responses/BasicResponse';
import { API } from '../API';

export function useAPICreateList() {
  return useMutation<BasicResponse, AxiosError, ListBody>({
    mutationKey: ['create-list'],
    mutationFn: (request) => API.put<BasicResponse>('/api/lists', request),
  });
}
