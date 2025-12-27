import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { CreateGameRequest } from '../../types/api/requests/CreateGameRequest';
import type { BasicResponse } from '../../types/api/responses/BasicResponse';
import { API } from '../API';

export function useAPIAddGame() {
  return useMutation<BasicResponse, AxiosError, CreateGameRequest>({
    mutationKey: ['add-game'],
    mutationFn: (request) => API.put<BasicResponse>(`/api/games`, request),
  });
}
