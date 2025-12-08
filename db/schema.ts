import {integer, sqliteTable, text} from 'drizzle-orm/sqlite-core';

export const lists = sqliteTable('lists', {
	id: text('id').notNull(),
	createdAt: integer('createdAt', { mode: 'timestamp' }).notNull(),
	name: text('name').notNull(),
	game: text('game').notNull(),
	army: text('army').notNull(),
	points: integer('points').notNull(),
	actualPoints: integer('actualPoints'),
	groups: text('groups').notNull(),
	image: text('image'),
	description: text('description'),
	isDeleted: integer('isDeleted', { mode: 'boolean' }).default(false).notNull(),
});

export const games = sqliteTable('games', {
	id: text('id').notNull(),
	inviteCode: text('id').notNull(),
	createdAt: integer('createdAt', { mode: 'timestamp' }).notNull(),
	game: text('game').notNull(),
	points: integer('points').notNull(),
	members: text('members').notNull(),
	image: text('image'),
	description: text('description'),
	isStarted: integer('isStarted', { mode: 'boolean' }),
});

export const friends = sqliteTable('friends', {
	id: text('id').notNull(),
	createdAt: integer('createdAt', { mode: 'timestamp' }).notNull(),
	username: text('username').notNull(),
	image: text('image'),
});

export const groups = sqliteTable('groups', {
	id: text('id').notNull(),
	createdAt: integer('createdAt', { mode: 'timestamp' }).notNull(),
	name: text('game').notNull(),
	image: text('image'),
	description: text('description'),
	isPublic: integer('isPublic', { mode: 'boolean' }).notNull(),
	admins: text('admins').notNull(),
	members: text('members').notNull(),
});
