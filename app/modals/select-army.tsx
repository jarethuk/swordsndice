import {faMagnifyingGlass} from '@awesome.me/kit-34e2017de2/icons/duotone/solid';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {router} from 'expo-router';
import {useMemo, useState} from 'react';
import {Animated, View} from 'react-native';
import {Content} from '../../components';
import {Input} from '../../components/Input';
import {NextWindowButton} from '../../components/NextWindowButton';
import {Armies} from '../../data/Armies';
import {useColours} from '../../hooks/useColours';
import {useNewListActions, useNewListGame,} from '../../states/useNewListStore';
import ScrollView = Animated.ScrollView;

export default function SelectArmy() {
	const game = useNewListGame();
	const { setArmy } = useNewListActions();

	const colours = useColours();
	const [search, setSearch] = useState('');

	const armies = useMemo(() => {
		return Armies.filter((x) => x.game === game).filter(
			(x) => !search || x.name.includes(search),
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
		<ScrollView contentContainerClassName={'flex flex-col gap-6 p-6'}>
			<Content size={'sm'} type={'title'} center>
				Select Army
			</Content>

			<Input
				placeholder={'Search'}
				value={search}
				onChange={setSearch}
				type={'search'}
				iconStart={
					<FontAwesomeIcon
						icon={faMagnifyingGlass}
						size={16}
						color={colours.primary}
					/>
				}
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
		</ScrollView>
	);
}
