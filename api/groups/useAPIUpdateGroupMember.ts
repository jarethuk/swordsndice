import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { UpdateGroupMemberRequest } from '../../types/api/requests/UpdateGroupMemberRequest';
import type { BasicResponse } from '../../types/api/responses/BasicResponse';
import { API } from '../API';

export function useAPIUpdateGroupMember(id: string) {
	return useMutation<BasicResponse, AxiosError, UpdateGroupMemberRequest>({
		mutationKey: ['update-group-member', id],
		mutationFn: (request) =>
			API.patch<BasicResponse>(
				`/api/groups/${id}/member/${request.id}`,
				request,
			),
	});
}
