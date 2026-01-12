import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { UpdateGameMemberRequest } from '../../types/api/requests/UpdateGameMemberRequest';
import type { BasicResponse } from '../../types/api/responses/BasicResponse';
import { API } from '../API';

interface Request {
  memberId: string;
  data: UpdateGameMemberRequest;
}

export function useAPIUpdateGameMember(id: string) {
  return useMutation<BasicResponse, AxiosError, Request>({
    mutationKey: ['update-game-member', id],
    mutationFn: ({ memberId, data }) =>
      API.patch<BasicResponse>(`/api/games/${id}/member/${memberId}`, data),
  });
}
