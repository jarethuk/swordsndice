import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { InviteUserToGameRequest } from '../../types/api/requests/InviteUserToGameRequest';
import type { BasicResponse } from '../../types/api/responses/BasicResponse';
import { API } from '../API';

export function useAPIInviteToGame(id: string) {
	return useMutation<BasicResponse, AxiosError, InviteUserToGameRequest>({
		mutationKey: ['invite-to-game', id],
		mutationFn: (request) =>
			API.put<BasicResponse>(`/api/games/${id}/invite`, request),
	});
}
