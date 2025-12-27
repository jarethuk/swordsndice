import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { BasicResponse } from '../../types/api/responses/BasicResponse';
import { API } from '../API';

interface Props {
  friendId: string;
}

export function useAPIAddFriend() {
  return useMutation<BasicResponse, AxiosError, Props>({
    mutationKey: ['add-friend', ({ friendId }: Props) => friendId],
    mutationFn: ({ friendId }) => API.put<BasicResponse>(`/api/friends/${friendId}`, {}),
  });
}
