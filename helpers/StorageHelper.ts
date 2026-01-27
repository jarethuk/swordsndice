import AsyncStorage from '@react-native-async-storage/async-storage';
import type { StorageKey } from '../types/Enums';

export class StorageHelper {
	public static async get<T>(key: StorageKey | string): Promise<T | undefined> {
		const item = await AsyncStorage.getItem(key);

		if (!item) {
			return undefined;
		}

		try {
			return JSON.parse(item);
		} catch {
			return item as T;
		}
	}

	public static async set(key: StorageKey | string, value: any) {
		if (typeof value !== 'string') {
			return AsyncStorage.setItem(key, JSON.stringify(value));
		}

		return AsyncStorage.setItem(key, value);
	}

	public static async delete(key: StorageKey | string) {
		return AsyncStorage.removeItem(key);
	}

	public static async clearStorage() {
		return AsyncStorage.clear();
	}
}
