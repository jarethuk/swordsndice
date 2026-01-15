import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { UpdateGameRequest } from '../../types/api/requests/UpdateGameRequest';
import type { BasicResponse } from '../../types/api/responses/BasicResponse';
import { API } from '../API';

export const apiUpdateGame = (id: string, request: UpdateGameRequest) =>
	API.patch<BasicResponse>(`/api/games/${id}`, request);

export function useAPIUpdateGame(id: string) {
	return useMutation<BasicResponse, AxiosError, UpdateGameRequest>({
		mutationKey: ['update-game', id],
		mutationFn: (request) => apiUpdateGame(id, request),
	});
}
