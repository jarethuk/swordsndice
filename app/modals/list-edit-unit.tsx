import {router, useLocalSearchParams} from 'expo-router';
import {useCallback, useMemo, useState} from 'react';
import {View} from 'react-native';
import {Content} from '../../components';
import AmountSelector from '../../components/AmountSelector';
import {Button} from '../../components/Button';
import EquipmentSelector from '../../components/EquipmentSelector';
import StatsRow from '../../components/StatsRow';
import {MESBGProfiles} from '../../data/MESBGProfiles';
import {getMESBGStats} from '../../helpers/MESBGStatsHelper';
import {useList, useListActions} from '../../states/useListStore';
import type {ListMember, ListMemberEquipment} from '../../types/List';
import type {MESBGProfileStats} from '../../types/MESBGProfileStats';

interface MemberWithStats extends ListMember {
	fullStats: MESBGProfileStats;
}

export default function EditUnitPopup() {
	const list = useList();
	const { updateList } = useListActions();
	const { groupId, memberId, availableUnits } = useLocalSearchParams();

	const { member, isLeader } = useMemo((): {
		member?: MemberWithStats;
		isLeader?: boolean;
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
			};
		}

		const member = group.members.find((x) => x.id === memberId);

		if (!member) {
			router.dismiss();
			return {};
		}

		const profile = MESBGProfiles.find((x) => x.name === group.leader.name);

		if (!profile) return {};

		return {
			member: {
				...member,
				fullStats: getMESBGStats(profile),
			},
			isLeader: false,
		};
	}, [list, groupId, memberId]);

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
		} else {
			const groupMember = group.members.find((x) => x.id === member.id);

			if (!groupMember) return;

			groupMember.equipment = equipment;
			groupMember.amount = amount;
		}

		await updateList({
			groups: list.groups,
		});

		router.dismiss();
	}, [list, groupId, equipment, isLeader, amount]);

	if (!member) return null;

	return (
		<View className={'flex flex-col gap-6 p-6 pb-12 h-full'}>
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

				{!isLeader && (
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
			</View>

			<Button content={'Save'} onPress={onSave} />
		</View>
	);
}
