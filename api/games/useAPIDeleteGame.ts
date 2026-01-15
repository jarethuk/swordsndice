import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { BasicResponse } from '../../types/api/responses/BasicResponse';
import { API } from '../API';

export function useAPIDeleteGame() {
	return useMutation<BasicResponse, AxiosError, string>({
		mutationKey: ['delete-game', (id: string) => id],
		mutationFn: (id) => API.delete<BasicResponse>(`/api/games/${id}`),
	});
}
