import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { InviteToGroupRequest } from '../../types/api/requests/InviteToGroupRequest';
import type { BasicResponse } from '../../types/api/responses/BasicResponse';
import { API } from '../API';

export function useAPIInviteToGroup(id: string) {
	return useMutation<BasicResponse, AxiosError, InviteToGroupRequest>({
		mutationKey: ['invite-to-group', id],
		mutationFn: (request) =>
			API.put<BasicResponse>(`/api/groups/${id}/invite`, request),
	});
}
