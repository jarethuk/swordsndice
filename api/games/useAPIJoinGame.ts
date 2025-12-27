import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { JoinGameRequest } from '../../types/api/requests/JoinGameRequest';
import type { BasicResponse } from '../../types/api/responses/BasicResponse';
import { API } from '../API';

export function useAPIJoinGame(id: string) {
	return useMutation<BasicResponse, AxiosError, JoinGameRequest>({
		mutationKey: ['join-game'],
		mutationFn: (request) =>
			API.put<BasicResponse>(`/api/games/${id}/join`, request),
	});
}
