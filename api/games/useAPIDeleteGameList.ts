import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { BasicResponse } from '../../types/api/responses/BasicResponse';
import { API } from '../API';

export function useAPIDeleteGameList(id: string) {
	return useMutation<BasicResponse, AxiosError>({
		mutationKey: ['delete-game-list'],
		mutationFn: () => API.delete<BasicResponse>(`/api/games/${id}/list`),
	});
}
