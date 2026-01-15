import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { LoginRequest } from '../../types/api/requests/LoginRequest';
import type { BasicResponse } from '../../types/api/responses/BasicResponse';
import type { UserResponse } from '../../types/api/responses/UserResponse';
import { API } from '../API';

export function useAPILogin() {
	return useMutation<BasicResponse | UserResponse, AxiosError, LoginRequest>({
		mutationKey: ['login'],
		mutationFn: (data) =>
			API.put<BasicResponse | UserResponse>('/api/auth/login', data),
	});
}
