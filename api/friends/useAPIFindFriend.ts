import { useQuery } from '@tanstack/react-query';
import type { PublicUser } from '../../types/api/responses/PublicUser';
import { API } from '../API';

export function useAPIFindFriend(search: string, page = 1) {
	return useQuery<PublicUser[]>({
		queryKey: ['find-friend', search, page],
		queryFn: () =>
			API.get<PublicUser[]>(`/api/friends/find?search=${search}&page=${page}`),
		enabled: !!search,
	});
}
