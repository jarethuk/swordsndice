import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { ListBody } from '../../types/api/ListBody';
import type { BasicResponse } from '../../types/api/responses/BasicResponse';
import { API } from '../API';

interface Request {
  list: ListBody;
  id: string;
}

export function useAPIUpdateGameList() {
  return useMutation<BasicResponse, AxiosError, Request>({
    mutationKey: ['update-game-list'],
    mutationFn: ({ id, list }) => API.patch<BasicResponse>(`/api/games/${id}/list`, list),
  });
}
