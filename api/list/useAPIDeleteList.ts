import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { BasicResponse } from '../../types/api/responses/BasicResponse';
import { API } from '../API';

export function useAPIDeleteList(id: string) {
  return useMutation<BasicResponse, AxiosError>({
    mutationKey: ['delete-list', id],
    mutationFn: () => API.delete<BasicResponse>(`/api/lists/${id}`),
  });
}
