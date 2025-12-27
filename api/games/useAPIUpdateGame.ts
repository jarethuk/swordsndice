import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { UpdateGameRequest } from '../../types/api/requests/UpdateGameRequest';
import type { BasicResponse } from '../../types/api/responses/BasicResponse';
import { API } from '../API';

export function useAPIUpdateGame(id: string) {
  return useMutation<BasicResponse, AxiosError, UpdateGameRequest>({
    mutationKey: ['update-game', id],
    mutationFn: (request) => API.put<BasicResponse>(`/api/games/${id}`, request),
  });
}
