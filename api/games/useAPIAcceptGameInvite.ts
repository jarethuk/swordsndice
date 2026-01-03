import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { BasicResponse } from '../../types/api/responses/BasicResponse';
import { API } from '../API';

export function useAPIAcceptGameInvite() {
  return useMutation<BasicResponse, AxiosError, string>({
    mutationKey: ['accept-game-invite'],
    mutationFn: (id: string) => API.patch<BasicResponse>(`/api/games/${id}/invite/accept`, {}),
  });
}
