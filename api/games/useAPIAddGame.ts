import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { CreateGameRequest } from '../../types/api/requests/CreateGameRequest';
import type { IdResponse } from '../../types/api/responses/IdResponse';
import { API } from '../API';

export function useAPIAddGame() {
	return useMutation<IdResponse, AxiosError, CreateGameRequest>({
		mutationKey: ['add-game'],
		mutationFn: (request) => API.put<IdResponse>(`/api/games`, request),
	});
}
