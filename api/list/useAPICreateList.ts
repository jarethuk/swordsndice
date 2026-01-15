import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { ListBody } from '../../types/api/ListBody';
import type { IdResponse } from '../../types/api/responses/IdResponse';
import { API } from '../API';

export function useAPICreateList() {
	return useMutation<IdResponse, AxiosError, ListBody>({
		mutationKey: ['create-list'],
		mutationFn: (request) => API.put<IdResponse>('/api/lists', request),
	});
}
