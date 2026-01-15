import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { ListBody } from '../../types/api/ListBody';
import type { BasicResponse } from '../../types/api/responses/BasicResponse';
import { API } from '../API';

export const apiUpdateList = (id: string, request: ListBody) =>
	API.patch<BasicResponse>(`/api/lists/${id}`, request);

export function useAPIUpdateList(id: string) {
	return useMutation<BasicResponse, AxiosError, ListBody>({
		mutationKey: ['update-list', id],
		mutationFn: (request) => apiUpdateList(id, request),
	});
}
