import {integer, sqliteTable, text,} from 'drizzle-orm/sqlite-core';

export const lists = sqliteTable('lists', {
	id: text('id'),
	createdAt: integer('createdAt', { mode: 'timestamp' }).notNull(),
	name: text('name').notNull(),
	game: text('game').notNull(),
	army: text('army').notNull(),
	points: integer('points').notNull(),
	groups: text('groups').notNull(),
	image: text('image'),
	description: text('description'),
});
