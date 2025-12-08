import {eq} from 'drizzle-orm';
import type {Game} from '../types/Game';
import {Database} from './Database';
import {games} from './schema';

export const addDBGame = (record: Game) => {
	const dbRecord = {
		...record,
		members: JSON.stringify(record.members),
	};

	return Database.db.insert(games).values(dbRecord);
};

export const updateDBGame = (id: string, record: Partial<Game>) => {
	const dbRecord = {
		...record,
		...(record.members && { members: JSON.stringify(record.members) }),
	};

	return Database.db
		.update(games)
		.set(dbRecord as any)
		.where(eq(games.id, id));
};

export const deleteDBGame = (id: string) => {
	return Database.db.delete(games).where(eq(games.id, id));
};

export const getDBGame = async (id: string): Promise<Game | null> => {
	const records = await Database.db
		.select()
		.from(games)
		.where(eq(games.id, id));

	if (records.length === 0) {
		return null;
	}

	return {
		...records[0],
		members: JSON.parse(records[0].members),
	} as Game;
};
