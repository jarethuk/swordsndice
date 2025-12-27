import { type UseQueryOptions, useQuery } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

export function usePersistedQuery<T>(options: UseQueryOptions<T, AxiosError>) {
	return useQuery({
		...options,
		meta: {
			persist: true,
		},
	});
}
