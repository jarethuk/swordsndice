import {useCallback, useMemo} from 'react';
import {View} from 'react-native';
import {MESBGArmies} from '../../data/MESBGArmies';
import {MESBGProfiles} from '../../data/MESBGProfiles';
import {updateDBList} from '../../db/DBLists';
import {getMESBGStats} from '../../helpers/MESBGStatsHelper';
import {getRandomId} from '../../helpers/RandomHelper';
import {MESBGArmySlot} from '../../types';
import type {List} from '../../types/List';
import type {MESBGProfileStats} from '../../types/MESBGProfileStats';
import type {Profile} from '../../types/Profile';
import {Content} from '../Content';
import HeroPoints from '../HeroPoints';
import {Popup} from '../Popup';
import {PopupRow} from '../PopupRow';

interface Props {
	onDismiss: () => void;
	onSelect: () => void;
	list: List;
}

interface Leader extends Profile {
	slot: MESBGArmySlot;
	fullStats: MESBGProfileStats;
}

export default function AddWarbandPopup({ onDismiss, list, onSelect }: Props) {
	const leaders: Leader[] = useMemo(() => {
		const army = MESBGArmies.find((x) => x.name === list.army);

		if (!army) {
			return [];
		}

		const leaders: Leader[] = [];

		for (const profile of army.profiles) {
			if (profile.slot === MESBGArmySlot.Warrior) continue;

			const leader = MESBGProfiles.find((x) => x.name === profile.name);
			if (!leader) continue;

			leaders.push({
				...leader,
				slot: profile.slot,
				fullStats: getMESBGStats(leader),
			});
		}

		return leaders;
	}, [list]);

	const groups = useMemo(() => {
		const slots = new Set(leaders.map(({ slot }) => slot));

		return Array.from(slots).map((slot) => ({
			name: slot,
			leaders: leaders
				.filter((x) => x.slot === slot)
				.sort((a, b) => a.name.localeCompare(b.name)),
		}));
	}, [leaders]);

	const addWarband = useCallback(
		async (leader: Profile) => {
			if (!list) return;

			const groups = list.groups ?? [];

			groups.push({
				id: getRandomId(),
				leader: {
					name: leader.name,
					points: leader.points,
					equipment: [],
				},
				members: [],
			});

			await updateDBList(list.id, {
				groups,
			});

			onSelect();
		},
		[list, onSelect],
	);

	return (
		<Popup onDismiss={onDismiss}>
			<View className={'flex flex-col gap-6'}>
				<Content size={'xs'} type={'title'} center>
					Select a Leader
				</Content>

				{groups.map(({ name, leaders }) => (
					<View key={name} className={'flex gap-4'}>
						<Content size={'md'} type={'subtitle'}>
							{name}
						</Content>

						{leaders.map((leader) => (
							<PopupRow
								key={leader.name}
								title={leader.name}
								onPress={() => addWarband(leader)}
								bottom={<HeroPoints profile={leader} variant={'white'} />}
							/>
						))}
					</View>
				))}
			</View>
		</Popup>
	);
}
