import {faSword} from '@awesome.me/kit-34e2017de2/icons/duotone/solid';
import {eq} from 'drizzle-orm';
import {useLiveQuery} from 'drizzle-orm/expo-sqlite';
import {router} from 'expo-router';
import {useMemo} from 'react';
import {View} from 'react-native';
import {Content} from '../../components';
import ListRow from '../../components/ListRow';
import {Database} from '../../db/Database';
import {lists} from '../../db/schema';
import {useNewGameActions} from '../../states/useNewGameStore';
import type {List} from '../../types/List';

export default function SelectListModal() {
	const { setList } = useNewGameActions();
	const { data } = useLiveQuery(
		Database.db.select().from(lists).where(eq(lists.isDeleted, false)),
	);

	const userLists: List[] = useMemo(() => {
		return data.map(
			(x) =>
				({
					...x,
					groups: JSON.parse(x.groups),
				}) as List,
		);
	}, [data]);

	return (
		<View className={'flex flex-col gap-6 p-6'}>
			<Content size={'sm'} type={'title'} center>
				Select List
			</Content>

			{userLists.map((list) => (
				<ListRow
					key={`${list.id}`}
					title={list.name}
					image={list.image}
					right={`${list.points}pts`}
					subtitle={list.army}
					onPress={() => {
						setList(list);
						router.dismiss();
					}}
					placeHolderIcon={faSword}
				/>
			))}
		</View>
	);
}
