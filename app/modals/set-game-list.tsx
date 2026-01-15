import {
	faMagnifyingGlass,
	faSword,
} from '@awesome.me/kit-34e2017de2/icons/duotone/solid';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { useAPIUpdateGameList } from '../../api/games/useAPIUpdateGameList';
import { useAPILists } from '../../api/list/useAPILists';
import { Dialog } from '../../components/Dialog';
import { FAIcon } from '../../components/FAIcon';
import { Input } from '../../components/Input';
import ListRow from '../../components/ListRow';
import type { ListBody } from '../../types/api/ListBody';

export default function SetGameList() {
	const { id } = useLocalSearchParams();
	const [search, setSearch] = useState('');
	const { data } = useAPILists();

	const { mutateAsync: apiSetGameList } = useAPIUpdateGameList();

	const setList = useCallback(
		async (list: ListBody) => {
			await apiSetGameList({
				id: id as string,
				list,
			});

			router.back();
		},
		[apiSetGameList, id],
	);

	const lists = useMemo(() => {
		if (!data) return [];

		const lowered = search.toLowerCase();

		return search
			? data.filter((x) => x.name.toLowerCase().includes(lowered))
			: data;
	}, [search, data]);

	return (
		<Dialog title={'Select List'}>
			<Input
				placeholder={'Search'}
				value={search}
				onChange={setSearch}
				type={'search'}
				iconStart={<FAIcon icon={faMagnifyingGlass} colour="primary" />}
			/>

			{lists.map((list) => (
				<ListRow
					key={`${list.id}`}
					title={list.name}
					image={list.image}
					right={`${list.points}pts`}
					subtitle={list.army}
					onPress={() => setList(list)}
					placeHolderIcon={faSword}
				/>
			))}
		</Dialog>
	);
}
