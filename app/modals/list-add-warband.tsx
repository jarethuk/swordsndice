import { router } from 'expo-router';
import { useCallback, useMemo } from 'react';
import { View } from 'react-native';
import { Content } from '../../components';
import { Dialog } from '../../components/common/Dialog';
import HeroPoints from '../../components/list/HeroPoints';
import { NextWindowButton } from '../../components/common/NextWindowButton';
import StatsRow from '../../components/list/StatsRow';
import { MESBGArmies } from '../../data/MESBGArmies';
import { MESBGProfiles } from '../../data/MESBGProfiles';
import {
	getListUniqueLeaders,
	getMESBGStats,
} from '../../helpers/MESBGStatsHelper';
import { getRandomId } from '../../helpers/RandomHelper';
import { useList, useListActions } from '../../states/useListStore';
import { MESBGArmySlot } from '../../types';
import type { MESBGProfileStats } from '../../types/MESBGProfileStats';
import type { Profile } from '../../types/Profile';

interface Leader extends Profile {
	slot: MESBGArmySlot;
	fullStats: MESBGProfileStats;
}

export default function AddWarbandPopup() {
	const list = useList();
	const { updateList } = useListActions();

	const leaders: Leader[] = useMemo(() => {
		if (!list) return [];

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

		const existingLeaders = getListUniqueLeaders(list);
		return leaders.filter((x) => !existingLeaders.includes(x.name));
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
		async (leader: Profile, slot: MESBGArmySlot) => {
			if (!list) return;

			const groups = list.groups ?? [];

			groups.push({
				id: getRandomId(),
				leader: {
					id: getRandomId(),
					name: leader.name,
					points: leader.points,
					equipment: [],
					amount: 1,
					slot,
				},
				members: [],
			});

			await updateList({
				groups,
			});

			router.dismiss();
		},
		[list, updateList],
	);

	return (
		<Dialog title={'Select a Leader'}>
			<View className={'flex gap-12'}>
				{groups.map(({ name, leaders }) => (
					<View key={name} className={'flex gap-6'}>
						<Content size={'md'} type={'subtitle'}>
							{name}
						</Content>

						{leaders.map((leader) => (
							<NextWindowButton
								key={leader.name}
								label={`${leader.name} (${leader.points}pts)`}
								onPress={() => addWarband(leader, name)}
								bottom={<HeroPoints profile={leader} variant={'white'} />}
								subtitle={<StatsRow stats={leader.fullStats} />}
							/>
						))}
					</View>
				))}
			</View>
		</Dialog>
	);
}
