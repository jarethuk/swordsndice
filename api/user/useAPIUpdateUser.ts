import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { UpdateUserRequest } from '../../types/api/requests/UpdateUserRequest';
import type { BasicResponse } from '../../types/api/responses/BasicResponse';
import { API } from '../API';

export function useAPIUpdateUser() {
	return useMutation<BasicResponse, AxiosError, UpdateUserRequest>({
		mutationKey: ['update-user'],
		mutationFn: (request) => API.patch<BasicResponse>(`/api/user`, request),
	});
}
