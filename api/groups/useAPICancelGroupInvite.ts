import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { CancelInviteToGroupRequest } from '../../types/api/requests/CancelInviteToGroupRequest';
import type { BasicResponse } from '../../types/api/responses/BasicResponse';
import { API } from '../API';

export function useAPICancelGroupInvite(id: string) {
	return useMutation<BasicResponse, AxiosError, CancelInviteToGroupRequest>({
		mutationKey: ['cancel-group-invite', id],
		mutationFn: (request) =>
			API.patch<BasicResponse>(`/api/groups/${id}/invite/cancel`, request),
	});
}
