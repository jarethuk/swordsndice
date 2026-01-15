import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { BasicResponse } from '../../types/api/responses/BasicResponse';
import { API } from '../API';

export function useAPIDeleteList() {
	return useMutation<BasicResponse, AxiosError, string>({
		mutationKey: ['delete-list'],
		mutationFn: (id) => API.delete<BasicResponse>(`/api/lists/${id}`),
	});
}
