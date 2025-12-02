import type { Query } from '@tanstack/react-query';

// @ts-expect-error
export interface PersistableQuery extends Query {
	meta?: {
		persist?: boolean;
	};
}
