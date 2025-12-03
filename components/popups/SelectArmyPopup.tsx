import {useMemo} from 'react';
import {View} from 'react-native';
import {Armies} from '../../data/Armies';
import type {Games} from '../../types';
import {Content} from '../Content';
import {Popup} from '../Popup';
import {PopupRow} from '../PopupRow';

interface Props {
	onDismiss: () => void;
	onSelect: (army: string) => void;
	game: Games;
}

export default function SelectArmyPopup({ onSelect, onDismiss, game }: Props) {
	const armies = useMemo(() => {
		return Armies.filter((x) => x.game === game);
	}, [game]);

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
