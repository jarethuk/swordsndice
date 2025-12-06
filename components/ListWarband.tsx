import {faCrown, faTrashAlt,} from '@awesome.me/kit-34e2017de2/icons/duotone/solid';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {router} from 'expo-router';
import {useCallback, useMemo} from 'react';
import {Pressable, View} from 'react-native';
import {MESBGProfiles} from '../data/MESBGProfiles';
import {updateDBList} from '../db/DBLists';
import {
    getGroupPointsTotal,
    getMemberPointsTotal,
    getMESBGStats,
    maxWarbandForLeader,
} from '../helpers/MESBGStatsHelper';
import {useColours} from '../hooks/useColours';
import {MESBGArmySlot} from '../types';
import type {Army} from '../types/Army';
import type {List, ListGroup, ListMember} from '../types/List';
import {Button} from './Button';
import {Content} from './Content';
import EquipmentList from './EquipmentList';
import HeroPoints from './HeroPoints';

interface Props {
	index: number;
	army: Army;
	list: List;
	group: ListGroup;
	onDelete: () => void;
	refresh: () => void;
	canEdit?: boolean;
}

interface SelectedMember extends ListMember {
	isLeader: boolean;
}

export default function ListWarband({
	index,
	group,
	list,
	army,
	onDelete,
	canEdit,
	refresh,
}: Props) {
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

	const currentUnits = useMemo(() => {
		return group.members.reduce((acc, x) => acc + x.amount, 0);
	}, [army, group]);

	const deleteWarband = useCallback(async () => {
		const index = list.groups.findIndex((x) => x.id === group.id);
		list.groups.splice(index, 1);

		await updateDBList(list.id, {
			groups: list.groups,
		});

		onDelete();
	}, [list, group]);

	const removeMember = useCallback(
		async (memberId: string) => {
			const listGroup = list.groups.find((x) => x.id === group.id);

			if (!listGroup) return;

			const index = listGroup.members.findIndex((x) => x.id === memberId);
			listGroup.members.splice(index, 1);

			await updateDBList(list.id, {
				groups: list.groups,
			});

			refresh();
		},
		[group, list],
	);

	const groupPoints = useMemo(() => {
		return getGroupPointsTotal(group);
	}, [group]);

	if (!leader) return;

	return (
		<View className={'flex gap-4'}>
			<View className={'flex flex-row gap-2 items-center'}>
				<Content size={'xs'} type={'title'}>
					Warband {index + 1}
				</Content>

				<View className={'ml-auto flex flex-row gap-2 items-center'}>
					<Content size={'xs'} type={'title'} muted>
						{currentUnits}/{maxUnits} ({groupPoints}pts)
					</Content>

					{canEdit && (
						<Pressable className={'ml-auto'} onPress={deleteWarband}>
							<FontAwesomeIcon
								icon={faTrashAlt}
								color={colours.negative}
								size={16}
							/>
						</Pressable>
					)}
				</View>
			</View>

			{/* Leader */}
			<Pressable
				className={
					'flex gap-1 border-2 border-border-light dark:border-border-dark p-4 rounded-2xl'
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
					<FontAwesomeIcon icon={faCrown} size={16} color={colours.primary} />

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
						'border-2 border-border-light dark:border-border-dark p-4 rounded-2xl'
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

						<View className={'ml-auto flex flex-row gap-2 items-center'}>
							<Content size={'xs'} type={'title'} muted>
								{getMemberPointsTotal(member)}pts
							</Content>

							{canEdit && (
								<Pressable
									className={'ml-auto'}
									onPress={() => removeMember(member.id)}
								>
									<FontAwesomeIcon
										icon={faTrashAlt}
										color={colours.negative}
										size={16}
									/>
								</Pressable>
							)}
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
