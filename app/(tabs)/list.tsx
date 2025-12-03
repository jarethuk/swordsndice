import {faExclamationTriangle} from '@awesome.me/kit-34e2017de2/icons/duotone/solid';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {useLocalSearchParams} from 'expo-router';
import {useEffect, useState} from 'react';
import {View} from 'react-native';
import {Content} from '../../components';
import {getDBList} from '../../db/DBLists';
import {useColours} from '../../hooks/useColours';
import type {List} from '../../types/List';

export default function ListPage() {
	const colours = useColours();
	const { id } = useLocalSearchParams();
	const [list, setList] = useState<List | undefined | null>();

	useEffect(() => {
		if (!id || list?.id === id) return;

		getDBList(id as string).then((record) => {
			if (!record) {
				setList(null);
			} else {
				setList({
					...record,
					groups: JSON.parse(record.groups),
				} as List);
			}
		});
	}, [id, list]);

	if (list === null) {
		return (
			<View
				className={'flex flex-1 items-center justify-center gap-4 w-1/2 m-auto'}
			>
				<FontAwesomeIcon
					icon={faExclamationTriangle}
					size={26}
					color={colours.warning}
				/>

				<Content size={'sm'} type={'title'} center>
					List not found
				</Content>

				<Content size={'sm'} type={'subtitle'} center>
					We couldn't find this list. It may have been deleted.
				</Content>
			</View>
		);
	}

	return (
		<View className={'flex flex-col gap-6'}>
			<View>
				<Content size={'md'} type={'title'} center>
					{list?.name}
				</Content>

				<Content size={'md'} type={'subtitle'} center muted>
					{list?.army}
				</Content>
			</View>
		</View>
	);
}
