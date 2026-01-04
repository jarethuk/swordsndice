import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Animated, View } from 'react-native';
import { Content } from '../../components';
import AmountSelector from '../../components/AmountSelector';
import { Button } from '../../components/Button';
import EquipmentSelector from '../../components/EquipmentSelector';
import { Input } from '../../components/Input';
import StatsRow from '../../components/StatsRow';
import { MESBGProfiles } from '../../data/MESBGProfiles';
import { getMESBGStats } from '../../helpers/MESBGStatsHelper';
import { useList, useListActions } from '../../states/useListStore';
import type { ListMember, ListMemberEquipment } from '../../types/api/ListBody';
import type { MESBGProfileStats } from '../../types/MESBGProfileStats';
import ScrollView = Animated.ScrollView;

interface MemberWithStats extends ListMember {
  fullStats: MESBGProfileStats;
}

export default function EditUnitPopup() {
	const list = useList();
	const { updateList } = useListActions();
	const { groupId, memberId, availableUnits } = useLocalSearchParams();

	const { member, isLeader, isUnique } = useMemo((): {
		member?: MemberWithStats;
		isLeader?: boolean;
		isUnique?: boolean;
	} => {
		const group = list?.groups.find((x) => x.id === groupId);

		if (!group) {
			router.dismiss();
			return {};
		}

		if (group.leader.id === memberId) {
			const profile = MESBGProfiles.find((x) => x.name === group.leader.name);

			if (!profile) return {};

			return {
				member: {
					...group.leader,
					fullStats: getMESBGStats(profile),
				},
				isLeader: true,
				isUnique: profile.unique,
			};
		}

		const member = group.members.find((x) => x.id === memberId);

		if (!member) {
			router.dismiss();
			return {};
		}

		const profile = MESBGProfiles.find((x) => x.name === member.name);

		if (!profile) return {};

		return {
			member: {
				...member,
				fullStats: getMESBGStats(profile),
			},
			isLeader: false,
			isUnique: profile.unique,
		};
	}, [list, groupId, memberId]);

	const [notes, setNotes] = useState<string>(member?.notes ?? '');
	const [amount, setAmount] = useState(member?.amount ?? 1);
	const [equipment, setEquipment] = useState<ListMemberEquipment[]>(
		member?.equipment ?? [],
	);

	const maxUnits = Number(availableUnits ?? 1) + (member?.amount ?? 0);

	const onSave = useCallback(async () => {
		if (!list || !member) return;

		const group = list.groups.find((x) => x.id === groupId);

		if (!group) return;

		if (isLeader) {
			group.leader.equipment = equipment;
			group.leader.notes = notes;
		} else {
			const groupMember = group.members.find((x) => x.id === member.id);

			if (!groupMember) return;

			groupMember.equipment = equipment;
			groupMember.amount = amount;
			groupMember.notes = notes;
		}

		await updateList({
			groups: list.groups,
		});

		router.dismiss();
	}, [list, member, isLeader, updateList, groupId, equipment, notes, amount]);

	const removeMember = useCallback(async () => {
		if (!list) return;

		const listGroup = list.groups.find((x) => x.id === groupId);

		if (!listGroup) return;

		const index = listGroup.members.findIndex((x) => x.id === memberId);
		listGroup.members.splice(index, 1);

		await updateList({
			groups: list.groups,
		});

		router.dismiss();
	}, [groupId, list, memberId, updateList]);

	if (!member) return null;

	return (
		<ScrollView
			contentContainerClassName={'flex flex-col gap-6 p-6 pb-12'}
			keyboardDismissMode={'interactive'}
		>
			<Content size={'sm'} type={'title'} center>
				{member.name}
			</Content>

			<View
				className={
					'flex gap-4 border-2 border-border-light dark:border-border-dark p-4 rounded-2xl'
				}
			>
				<Content size={'xs'} type={'title'}>
					Stats
				</Content>

				<StatsRow profile={member} />
			</View>

			<View className={'flex flex-col gap-6 grow'}>
				<EquipmentSelector
					member={member}
					equipment={equipment}
					setEquipment={setEquipment}
				/>

				{!isUnique && (
					<View
						className={
							'flex gap-4 border-2 border-border-light dark:border-border-dark p-4 rounded-2xl'
						}
					>
						<Content size={'xs'} type={'title'}>
							Unit Size
						</Content>

						<AmountSelector
							value={amount}
							onChange={(value) => {
								setAmount(value);
							}}
							max={maxUnits}
						/>
					</View>
				)}

				<Input
					value={notes}
					onChange={setNotes}
					type={'text'}
					label={'Notes'}
					multiline
				/>

				{!isLeader && (
					<Button
						content={'Remove Unit'}
						onPress={removeMember}
						variant={'outline'}
					/>
				)}
			</View>

			<Button content={'Save'} onPress={onSave} />
		</ScrollView>
	);
}
