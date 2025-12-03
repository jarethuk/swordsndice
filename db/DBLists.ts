import {eq} from 'drizzle-orm';
import type {List} from '../types/List';
import {Database} from './Database';
import {lists} from './schema';

export const addDBList = (record: List) => {
	const dbRecord = {
		...record,
		groups: JSON.stringify(record.groups),
	};

	return Database.db.insert(lists).values(dbRecord);
};

export const updateDBList = (id: string, record: Partial<List>) => {
	return Database.db
		.update(lists)
		.set(record as any)
		.where(eq(lists.id, id));
};

export const deleteDBList = (id: string) => {
	return Database.db.delete(lists).where(eq(lists.id, id));
};

export const getDBList = async (id: string) => {
	const records = await Database.db
		.select()
		.from(lists)
		.where(eq(lists.id, id));

	if (records.length === 0) {
		return null;
	}

	return records[0];
};
