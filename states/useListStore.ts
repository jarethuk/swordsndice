import { create } from 'zustand';
import { apiUpdateList } from '../api/list/useAPIUpdateList';
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

        set({ list: newList });
      }
    },
  },
}));

export const useList = () => useListStore((x) => x.list);

export const useListActions = () => useListStore((x) => x.actions);
