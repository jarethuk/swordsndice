import {eq} from 'drizzle-orm';
import type {Friend} from '../types/Friend';
import {Database} from './Database';
import {friends} from './schema';

export const addDBFriend = (record: Friend) => {
	const dbRecord = {
		...record,
	};

	return Database.db.insert(friends).values(dbRecord);
};

export const updateDBFriend = (id: string, record: Partial<Friend>) => {
	const dbRecord = {
		...record,
	};

	return Database.db
		.update(friends)
		.set(dbRecord as any)
		.where(eq(friends.id, id));
};

export const deleteDBFriend = (id: string) => {
	return Database.db.delete(friends).where(eq(friends.id, id));
};

export const getDBFriend = async (id: string): Promise<Friend | null> => {
	const records = await Database.db
		.select()
		.from(friends)
		.where(eq(friends.id, id));

	if (records.length === 0) {
		return null;
	}

	return {
		...records[0],
	} as Friend;
};
