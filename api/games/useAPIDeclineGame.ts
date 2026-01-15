import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { BasicResponse } from '../../types/api/responses/BasicResponse';
import { API } from '../API';

export function useAPIDeclineGame() {
	return useMutation<BasicResponse, AxiosError, string>({
		mutationKey: ['decline-game'],
		mutationFn: (id: string) =>
			API.patch<BasicResponse>(`/api/games/${id}/invite/decline`, {}),
	});
}
