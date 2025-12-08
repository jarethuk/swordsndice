import {eq} from 'drizzle-orm';
import type {Group} from '../types/Group';
import {Database} from './Database';
import {groups} from './schema';

export const addDBGroup = (record: Group) => {
	const dbRecord = {
		...record,
		admins: JSON.stringify(record.admins),
		members: JSON.stringify(record.members),
	};

	return Database.db.insert(groups).values(dbRecord);
};

export const updateDBGroup = (id: string, record: Partial<Group>) => {
	const dbRecord = {
		...record,
		...(record.admins && { groups: JSON.stringify(record.admins) }),
		...(record.members && { groups: JSON.stringify(record.members) }),
	};

	return Database.db
		.update(groups)
		.set(dbRecord as any)
		.where(eq(groups.id, id));
};

export const deleteDBGroup = (id: string) => {
	return Database.db.delete(groups).where(eq(groups.id, id));
};

export const getDBGroup = async (id: string): Promise<Group | null> => {
	const records = await Database.db
		.select()
		.from(groups)
		.where(eq(groups.id, id));

	if (records.length === 0) {
		return null;
	}

	return {
		...records[0],
		admins: JSON.parse(records[0].admins),
		members: JSON.parse(records[0].members),
	} as Group;
};
