import {router} from 'expo-router';
import {useCallback, useMemo} from 'react';
import {Animated, View} from 'react-native';
import {Content} from '../../components';
import HeroPoints from '../../components/HeroPoints';
import {NextWindowButton} from '../../components/NextWindowButton';
import StatsRow from '../../components/StatsRow';
import {MESBGArmies} from '../../data/MESBGArmies';
import {MESBGProfiles} from '../../data/MESBGProfiles';
import {getListUniqueLeaders, getMESBGStats,} from '../../helpers/MESBGStatsHelper';
import {getRandomId} from '../../helpers/RandomHelper';
import {useList, useListActions} from '../../states/useListStore';
import {MESBGArmySlot} from '../../types';
import type {MESBGProfileStats} from '../../types/MESBGProfileStats';
import type {Profile} from '../../types/Profile';
import ScrollView = Animated.ScrollView;

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
		async (leader: Profile) => {
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
				},
				members: [],
			});

			await updateList({
				groups,
			});

			router.dismiss();
		},
		[list],
	);

	return (
		<ScrollView contentContainerClassName={'flex flex-col gap-6 p-6'}>
			<Content size={'sm'} type={'title'} center>
				Select a Leader
			</Content>

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
								onPress={() => addWarband(leader)}
								bottom={<HeroPoints profile={leader} variant={'white'} />}
								subtitle={<StatsRow profile={leader} />}
							/>
						))}
					</View>
				))}
			</View>
		</ScrollView>
	);
}
