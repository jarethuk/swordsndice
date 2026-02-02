import { create } from 'zustand';
import { apiUpdateList } from '../api/list/useAPIUpdateList';
import { hashObject } from '../helpers/Hasher';
import type { ListBody } from '../types/api/ListBody';

export interface ListStore {
	list?: ListBody;
	actions: {
		setList: (list?: ListBody) => void;
		updateList: (update: Partial<ListBody>) => Promise<void>;
	};
}

const useListStore = create<ListStore>((set, get) => ({
	actions: {
		setList: (list) => set({ list }),
		updateList: async (update: Partial<ListBody>) => {
			const { list } = get();

			if (list) {
				const newList = { ...list, ...update };

				await apiUpdateList(list.id as string, newList);

				const hash = await hashObject(newList);

				set({
					list: {
						...newList,
						hash,
					},
				});
			}
		},
	},
}));

export const useList = () => useListStore((x) => x.list);

export const useListActions = () => useListStore((x) => x.actions);
