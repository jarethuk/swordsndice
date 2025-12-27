import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { ListBody } from '../../types/api/ListBody';
import type { BasicResponse } from '../../types/api/responses/BasicResponse';
import { API } from '../API';

export function useAPIUpdateGameList(id: string) {
  return useMutation<BasicResponse, AxiosError, ListBody>({
    mutationKey: ['update-game-list'],
    mutationFn: (request) => API.patch<BasicResponse>(`/api/games/${id}/list`, request),
  });
}
