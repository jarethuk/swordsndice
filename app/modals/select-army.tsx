import { faMagnifyingGlass } from '@awesome.me/kit-34e2017de2/icons/duotone/solid';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { View } from 'react-native';
import { Content } from '../../components';
import { Dialog } from '../../components/Dialog';
import { FAIcon } from '../../components/FAIcon';
import { Input } from '../../components/Input';
import { NextWindowButton } from '../../components/NextWindowButton';
import { Armies } from '../../data/Armies';
import {
	useNewListActions,
	useNewListGame,
} from '../../states/useNewListStore';

export default function SelectArmy() {
	const game = useNewListGame();
	const { setArmy } = useNewListActions();

	const [search, setSearch] = useState('');

	const armies = useMemo(() => {
		const lowered = search?.toLowerCase();

		return Armies.filter((x) => x.game === game).filter(
			(x) => !lowered || x.name.toLowerCase().includes(lowered),
		);
	}, [game, search]);

	const groups = useMemo(() => {
		const names = new Set(armies.map(({ group }) => group));

		return Array.from(names).map((name) => ({
			name,
			armies: armies
				.filter((x) => x.group === name)
				.sort((a, b) => a.name.localeCompare(b.name)),
		}));
	}, [armies]);

	return (
		<Dialog title={'Select Army'}>
			<Input
				placeholder={'Search'}
				value={search}
				onChange={setSearch}
				type={'search'}
				iconStart={<FAIcon icon={faMagnifyingGlass} colour="primary" />}
			/>

			{groups.map(({ name, armies }) => (
				<View key={name} className={'flex gap-4'}>
					<Content size={'md'} type={'subtitle'}>
						{name}
					</Content>

					{armies.map(({ name }) => (
						<NextWindowButton
							key={name}
							label={name}
							onPress={() => {
								setArmy(name);
								router.dismiss();
							}}
						/>
					))}
				</View>
			))}
		</Dialog>
	);
}
