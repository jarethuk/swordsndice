import {create} from 'zustand';
import {getDBList, updateDBList} from '../db/DBLists';
import type {List} from '../types/List';

export interface ListStore {
	list?: List;
	actions: {
		setList: (list?: List) => void;
		updateList: (update: Partial<List>) => Promise<void>;
	};
}

const useListStore = create<ListStore>((set, get) => ({
	actions: {
		setList: (list) => set({ list }),
		updateList: async (update: Partial<List>) => {
			const { list } = get();

			if (list) {
				await updateDBList(list.id, update);

				const dbList = await getDBList(list.id);

				if (dbList) {
					set({ list: dbList });
				}
			}
		},
	},
}));

export const useList = () => useListStore((x) => x.list);

export const useListActions = () => useListStore((x) => x.actions);
