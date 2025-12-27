import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { BasicResponse } from '../../types/api/responses/BasicResponse';
import { API } from '../API';

interface Props {
  friendId: string;
}

export function useAPIRemoveFriend() {
  return useMutation<BasicResponse, AxiosError, Props>({
    mutationKey: ['remove-friend', ({ friendId }: Props) => friendId],
    mutationFn: ({ friendId }) => API.delete<BasicResponse>(`/api/friends/${friendId}`),
  });
}
