import {faTrashAlt} from '@awesome.me/kit-34e2017de2/icons/duotone/solid';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {useCallback, useMemo, useState} from 'react';
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
import Divider from './Divider';
import EquipmentList from './EquipmentList';
import HeroPoints from './HeroPoints';
import SelectEquipmentPopup from './popups/SelectEquipmentPopup';

interface Props {
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
	group,
	list,
	army,
	onDelete,
	canEdit,
	refresh,
}: Props) {
	const colours = useColours();
	const [selectingMemberEquipment, setSelectingMemberEquipment] = useState<
		SelectedMember | undefined
	>();

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

		onDelete();
	}, [list, group]);

	const groupPoints = useMemo(() => {
		return getGroupPointsTotal(group);
	}, [group]);

	if (!leader) return;

	return (
		<View className={'flex border-2 border-gray-300 p-4 rounded-2xl'}>
			<Pressable
				className={'flex flex-row items-center'}
				onPress={() =>
					canEdit &&
					setSelectingMemberEquipment({
						isLeader: true,
						...group.leader,
					})
				}
			>
				<Content size={'xs'} type={'title'}>
					{group?.leader.name} ({getMemberPointsTotal(group.leader)}pts)
				</Content>

				<View className={'ml-auto'}>
					<Content size={'xs'} type={'title'} muted>
						{group?.members.length}/{maxUnits} ({groupPoints}pts)
					</Content>
				</View>
			</Pressable>

			<View className={'flex flex-row items-center'}>
				<HeroPoints profile={leader} variant={'accent'} />

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

			<EquipmentList member={group.leader} />

			{(canEdit || group.members.length > 0) && <Divider className={'my-4'} />}

			{canEdit && <Button content={'Add Unit'} variant={'outline'} />}

			{selectingMemberEquipment && (
				<SelectEquipmentPopup
					onDismiss={() => setSelectingMemberEquipment(undefined)}
					onConfirm={() => {
						setSelectingMemberEquipment(undefined);
						refresh();
					}}
					member={selectingMemberEquipment}
					list={list}
					isLeader={selectingMemberEquipment.isLeader}
					groupId={group.id}
				/>
			)}
		</View>
	);
}
