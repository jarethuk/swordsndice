import {eq, inArray} from 'drizzle-orm';
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
	const dbRecord = {
		...record,
		...(record.groups && { groups: JSON.stringify(record.groups) }),
	};

	return Database.db
		.update(lists)
		.set(dbRecord as any)
		.where(eq(lists.id, id));
};

export const deleteDBList = (id: string) => {
	return Database.db
		.update(lists)
		.set({
			isDeleted: true,
		})
		.where(eq(lists.id, id));
};

export const getDBList = async (id: string): Promise<List | null> => {
	const records = await Database.db
		.select()
		.from(lists)
		.where(eq(lists.id, id));

	if (records.length === 0) {
		return null;
	}

	return {
		...records[0],
		groups: JSON.parse(records[0].groups),
	} as List;
};

export const getDBLists = async (ids: string[]): Promise<List[]> => {
	const records = await Database.db
		.select()
		.from(lists)
		.where(inArray(lists.id, ids));

	return records.map(
		(record) =>
			({
				...record,
				groups: JSON.parse(records[0].groups),
			}) as List,
	);
};
