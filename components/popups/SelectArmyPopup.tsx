import {faMagnifyingGlass} from '@awesome.me/kit-34e2017de2/icons/duotone/solid';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {useMemo, useState} from 'react';
import {View} from 'react-native';
import {Armies} from '../../data/Armies';
import {useColours} from '../../hooks/useColours';
import type {Games} from '../../types';
import {Content} from '../Content';
import {Input} from '../Input';
import {Popup} from '../Popup';
import {PopupRow} from '../PopupRow';

interface Props {
	onDismiss: () => void;
	onSelect: (army: string) => void;
	game: Games;
}

export default function SelectArmyPopup({ onSelect, onDismiss, game }: Props) {
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
		<Popup onDismiss={onDismiss}>
			<View className={'flex flex-col gap-6'}>
				<Content size={'xs'} type={'title'} center>
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
					isBottomSheet
				/>

				{groups.map(({ name, armies }) => (
					<View key={name} className={'flex gap-4'}>
						<Content size={'md'} type={'subtitle'}>
							{name}
						</Content>

						{armies.map(({ name }) => (
							<PopupRow
								key={name}
								title={name}
								onPress={() => onSelect(name)}
							/>
						))}
					</View>
				))}
			</View>
		</Popup>
	);
}
