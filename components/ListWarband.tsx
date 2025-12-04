import {faTrashAlt} from '@awesome.me/kit-34e2017de2/icons/duotone/solid';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {useCallback, useMemo} from 'react';
import {Pressable, View} from 'react-native';
import {MESBGProfiles} from '../data/MESBGProfiles';
import {updateDBList} from '../db/DBLists';
import {getMESBGStats, maxWarbandForLeader,} from '../helpers/MESBGStatsHelper';
import {useColours} from '../hooks/useColours';
import {MESBGArmySlot} from '../types';
import type {Army} from '../types/Army';
import type {List, ListGroup} from '../types/List';
import {Button} from './Button';
import {Content} from './Content';
import HeroPoints from './HeroPoints';

interface Props {
	army: Army;
	list: List;
	group: ListGroup;
	onDelete: () => void;
}

export default function ListWarband({ group, list, army, onDelete }: Props) {
	const colours = useColours();
	const leader = useMemo(() => {
		const armyProfile = army.profiles.find((x) => x.name === group.leader.name);
		const profile = MESBGProfiles.find((x) => x.name === group.leader.name);

		if (!armyProfile || !profile) return;

		return {
			...armyProfile,
			fullStats: getMESBGStats(profile),
		};
	}, []);

	const maxUnits = useMemo(() => {
		return maxWarbandForLeader(leader?.slot ?? MESBGArmySlot.Independent);
	}, [army, group]);

	const deleteWarband = useCallback(async () => {
		const index = list.groups.findIndex((x) => x.id === group.id);
		list.groups.splice(index, 1);

		await updateDBList(list.id, {
			groups: list.groups,
		});

		await onDelete();
	}, [list, group]);

	if (!leader) return;

	return (
		<View className={'flex border-2 border-gray-300 p-4 rounded-2xl'}>
			<View className={'flex flex-row items-center'}>
				<Content size={'xs'} type={'title'}>
					{group?.leader.name}
				</Content>

				<View className={'ml-auto'}>
					<Content size={'xs'} type={'title'} muted>
						{group?.members.length}/{maxUnits}
					</Content>
				</View>
			</View>

			<View className={'flex flex-row items-center'}>
				<HeroPoints profile={leader} variant={'accent'} />

				<Pressable className={'ml-auto'} onPress={deleteWarband}>
					<FontAwesomeIcon
						icon={faTrashAlt}
						color={colours.negative}
						size={16}
					/>
				</Pressable>
			</View>

			<View className={'h-0.5 w-full bg-gray-300 my-4'} />

			<Button content={'Add Unit'} variant={'outline'} />
		</View>
	);
}
