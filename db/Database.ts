import {drizzle, type ExpoSQLiteDatabase} from 'drizzle-orm/expo-sqlite';
import {migrate} from 'drizzle-orm/expo-sqlite/migrator';
import {deleteDatabaseAsync, openDatabaseSync, type SQLiteDatabase,} from 'expo-sqlite';
import migrations from '../drizzle/migrations';

const database = 'db2.db';

export class Database {
	public static db: ExpoSQLiteDatabase;
	private static initialised = false;
	private static expo: SQLiteDatabase;

	public static async init() {
		if (Database.initialised) return;

		console.log('Connecting to database...');

		Database.expo = openDatabaseSync(database, { enableChangeListener: true });
		Database.db = drizzle(Database.expo);

		console.log('Running migrations...');

		try {
			await migrate(Database.db, migrations);
		} catch (e) {
			console.log(e);
		}

		console.log('Database initialized');
		Database.initialised = true;
	}

	public static async resetDatabase() {
		console.log('Resetting database...');
		await Database.expo.closeAsync();
		await deleteDatabaseAsync(database);
		console.log('Database reset');

		Database.initialised = false;
		return Database.init();
	}
}
