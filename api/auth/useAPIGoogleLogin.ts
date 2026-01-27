import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { GoogleLoginRequest } from '../../types/api/requests/GoogleLoginRequest';
import type { BasicResponse } from '../../types/api/responses/BasicResponse';
import type { UserResponse } from '../../types/api/responses/UserResponse';
import { API } from '../API';

export function useAPIGoogleLogin() {
	return useMutation<
		BasicResponse | UserResponse,
		AxiosError,
		GoogleLoginRequest
	>({
		mutationKey: ['google-login'],
		mutationFn: (data) =>
			API.put<BasicResponse | UserResponse>('/api/auth/google-login', data),
	});
}
