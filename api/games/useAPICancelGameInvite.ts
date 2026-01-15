import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { InviteUserToGameRequest } from '../../types/api/requests/InviteUserToGameRequest';
import type { BasicResponse } from '../../types/api/responses/BasicResponse';
import { API } from '../API';

export function useAPICancelGameInvite(id: string) {
	return useMutation<BasicResponse, AxiosError, InviteUserToGameRequest>({
		mutationKey: ['cancel-game-invite'],
		mutationFn: (request) =>
			API.patch<BasicResponse>(`/api/games/${id}/invite/cancel`, request),
	});
}
