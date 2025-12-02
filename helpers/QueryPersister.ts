import type {
	PersistedClient,
	Persister,
} from '@tanstack/react-query-persist-client';
import { StorageHelper } from './StorageHelper';

export function createQueryPersister(queryKey = 'ReactQuery') {
	return {
		persistClient: (client: PersistedClient) => {
			return StorageHelper.set(queryKey, client);
		},
		restoreClient: async () => {
			return StorageHelper.get<PersistedClient>(queryKey);
		},
		removeClient: () => {
			return StorageHelper.delete(queryKey);
		},
	} as Persister;
}
