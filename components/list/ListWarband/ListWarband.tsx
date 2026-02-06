import {
	faCrown,
	faTrashAlt,
} from '@awesome.me/kit-6b5fd61d92/icons/duotone/solid';
import { router } from 'expo-router';
import { useCallback, useMemo } from 'react';
import { Pressable, View } from 'react-native';
import { MESBGProfiles } from '../../../data/MESBGProfiles';
import {
	getGroupPointsTotal,
	getMESBGStats,
	getMemberPointsTotal,
	maxWarbandForLeader,
} from '../../../helpers/MESBGStatsHelper';
import { useListActions } from '../../../states/useListStore';
import type { Army } from '../../../types/Army';
import type { ListBody, ListGroup } from '../../../types/api/ListBody';
import { MESBGArmySlot } from '../../../types/Enums';
import { Button } from '../../common/Button';
import { Content } from '../../common/Content';
import { FAIcon } from '../../common/FAIcon';
import EquipmentList from '../EquipmentList';
import HeroPoints from '../HeroPoints';

interface Props {
	index: number;
	army: Army;
	list: ListBody;
	group: ListGroup;
	canEdit?: boolean;
}

export default function ListWarband({
	index,
	group,
	list,
	army,
	canEdit,
}: Props) {
	const { updateList } = useListActions();

	const leader = useMemo(() => {
		const armyProfile = army.profiles.find((x) => x.name === group.leader.name);
		const profile = MESBGProfiles.find((x) => x.name === group.leader.name);

		if (!armyProfile || !profile) return;

		return {
			...armyProfile,
			fullStats: getMESBGStats(profile),
		};
	}, [army.profiles, group.leader.name]);

	const maxUnits = useMemo(() => {
		return maxWarbandForLeader(leader?.slot ?? MESBGArmySlot.Independent);
	}, [leader?.slot]);

	const currentUnits = useMemo(() => {
		return group.members
			.filter((x) => x.slot === MESBGArmySlot.Warrior)
			.reduce((acc, x) => acc + x.amount, 0);
	}, [group]);

	const deleteWarband = useCallback(async () => {
		const index = list.groups.findIndex((x) => x.id === group.id);
		list.groups.splice(index, 1);

		await updateList({
			groups: list.groups,
		});
	}, [list.groups, updateList, group.id]);

	const groupPoints = useMemo(() => {
		return getGroupPointsTotal(group);
	}, [group]);

	if (!leader) return;

	return (
		<View className={'flex gap-4'}>
			<View className={'flex flex-row items-center gap-2'}>
				<Content size={'xs'} type={'title'}>
					Warband {index + 1}
				</Content>

				<View className={'ml-auto flex flex-row items-center gap-2'}>
					<Content size={'xs'} type={'title'} muted>
						{currentUnits}/{maxUnits} ({groupPoints}pts)
					</Content>

					{canEdit && (
						<Pressable className={'ml-auto'} onPress={deleteWarband}>
							<FAIcon icon={faTrashAlt} colour="negative" />
						</Pressable>
					)}
				</View>
			</View>

			{/* Leader */}
			<Pressable
				className={
					'border-border-light dark:border-border-dark flex gap-1 rounded-2xl border-2 p-4'
				}
				onPress={() =>
					canEdit &&
					router.navigate({
						pathname: '/modals/list-edit-unit',
						params: {
							groupId: group.id,
							memberId: group.leader.id,
						},
					})
				}
			>
				<View className={'flex flex-row items-center gap-1'}>
					<FAIcon icon={faCrown} colour="primary" />

					<Content size={'xs'} type={'title'}>
						{group?.leader.name} ({getMemberPointsTotal(group.leader)}pts)
					</Content>

					<View className={'ml-auto'}>
						<Content size={'xs'} type={'title'} muted>
							{getMemberPointsTotal(group.leader)}pts
						</Content>
					</View>
				</View>

				<HeroPoints profile={leader} variant={'accent'} />

				<EquipmentList member={group.leader} />
			</Pressable>

			{/* Members */}
			{group.members.map((member) => (
				<Pressable
					key={member.id}
					className={
						'border-border-light dark:border-border-dark rounded-2xl border-2 p-4'
					}
					onPress={() =>
						canEdit &&
						router.navigate({
							pathname: '/modals/list-edit-unit',
							params: {
								groupId: group.id,
								memberId: member.id,
								availableUnits: maxUnits - currentUnits,
							},
						})
					}
				>
					<View className={'flex flex-row items-center'}>
						<Content size={'xs'} type={'title'}>
							{member.name} x {member.amount}
						</Content>

						<View className={'ml-auto flex flex-row items-center gap-2'}>
							<Content size={'xs'} type={'title'} muted>
								{getMemberPointsTotal(member)}pts
							</Content>
						</View>
					</View>

					<EquipmentList member={member} />
				</Pressable>
			))}

			{canEdit && (
				<Button
					content={'Add Unit'}
					variant={'outline'}
					onPress={() =>
						router.navigate({
							pathname: '/modals/list-add-unit',
							params: {
								groupId: group.id,
								availableUnits: maxUnits - currentUnits,
							},
						})
					}
					disabled={currentUnits === maxUnits}
				/>
			)}
		</View>
	);
}
