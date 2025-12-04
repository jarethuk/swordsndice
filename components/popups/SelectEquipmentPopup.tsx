import {useCallback, useMemo, useState} from 'react';
import {View} from 'react-native';
import {MESBGProfiles} from '../../data/MESBGProfiles';
import {updateDBList} from '../../db/DBLists';
import type {List, ListMember, ListMemberEquipment} from '../../types/List';
import type {Equipment} from '../../types/Profile';
import {Button} from '../Button';
import {Content} from '../Content';
import {Popup} from '../Popup';
import Toggle from '../Toggle';

interface Props {
	onDismiss: () => void;
	onConfirm: () => void;
	list: List;
	groupId: string;
	isLeader: boolean;
	member: ListMember;
}

export default function SelectEquipmentPopup({
	onDismiss,
	onConfirm,
	isLeader,
	member,
	list,
	groupId,
}: Props) {
	const [selected, setSelected] = useState<ListMemberEquipment[]>(
		member.equipment,
	);

	const profile = useMemo(() => {
		return MESBGProfiles.find((x) => x.name === member.name);
	}, [member]);

	const onChange = useCallback(
		(equipment: Equipment) => {
			const index = selected.findIndex((x) => x.name === equipment.name);
			if (index >= 0) {
				const newSelected = [...selected];
				newSelected.splice(index, 1);
				setSelected(newSelected);
			} else {
				setSelected([...selected, equipment]);
			}
		},
		[selected],
	);

	const onSave = useCallback(async () => {
		const group = list.groups.find((x) => x.id === groupId);

		if (!group) return;

		if (isLeader) {
			group.leader.equipment = selected;
		} else {
			const groupMember = group.members.find((x) => x.id === member.id);

			if (!groupMember) return;

			groupMember.equipment = selected;
		}

		await updateDBList(list.id, {
			groups: list.groups,
		});

		onConfirm();
	}, [list, groupId, selected, isLeader, onConfirm]);

	if (!profile) return;

	return (
		<Popup onDismiss={onDismiss}>
			<View className={'flex flex-col gap-6'}>
				<Content size={'xs'} type={'title'} center>
					Select Equipment
				</Content>

				{profile.equipment.map((equipment) => (
					<View
						key={equipment.name}
						className={'flex flex-row items-center gap-4'}
					>
						<Content size={'md'} type={'subtitle'}>
							{equipment.name} ({equipment.points}pts)
						</Content>

						<Toggle
							className={'ml-auto'}
							value={!!selected.find((x) => x.name === equipment.name)}
							onChange={() => onChange(equipment)}
						/>
					</View>
				))}

				<Button content={'Save'} onPress={onSave} />
			</View>
		</Popup>
	);
}
