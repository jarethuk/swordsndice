import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { CreateFeedbackRequest } from '../../types/api/requests/CreateFeedbackRequest';
import type { BasicResponse } from '../../types/api/responses/BasicResponse';
import { API } from '../API';

export function useAPICreateFeedback() {
	return useMutation<BasicResponse, AxiosError, CreateFeedbackRequest>({
		mutationKey: ['create-feedback'],
		mutationFn: (request) => API.put<BasicResponse>(`/api/feedback`, request),
	});
}
