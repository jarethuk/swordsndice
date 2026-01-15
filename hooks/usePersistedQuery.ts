import { type UseQueryOptions, useQuery } from '@tanstack/react-query';

export function usePersistedQuery<T>(options: UseQueryOptions<T>) {
	return useQuery<T>({
		...options,
		meta: {
			persist: true,
		},
	});
}
