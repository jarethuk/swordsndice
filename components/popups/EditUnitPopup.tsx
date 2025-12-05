import {useCallback, useState} from 'react';
import {View} from 'react-native';
import {updateDBList} from '../../db/DBLists';
import type {List, ListMember, ListMemberEquipment} from '../../types/List';
import AmountSelector from '../AmountSelector';
import {Button} from '../Button';
import {Content} from '../Content';
import EquipmentSelector from '../EquipmentSelector';
import {Popup} from '../Popup';

interface Props {
	onDismiss: () => void;
	onConfirm: () => void;
	list: List;
	groupId: string;
	isLeader: boolean;
	member: ListMember;
}

export default function EditUnitPopup({
	onDismiss,
	onConfirm,
	isLeader,
	member,
	list,
	groupId,
}: Props) {
	const [amount, setAmount] = useState(member.amount);
	const [equipment, setEquipment] = useState<ListMemberEquipment[]>(
		member.equipment,
	);

	const onSave = useCallback(async () => {
		const group = list.groups.find((x) => x.id === groupId);

		if (!group) return;

		if (isLeader) {
			group.leader.equipment = equipment;
		} else {
			const groupMember = group.members.find((x) => x.id === member.id);

			if (!groupMember) return;

			groupMember.equipment = equipment;
		}

		await updateDBList(list.id, {
			groups: list.groups,
		});

		onConfirm();
	}, [list, groupId, equipment, isLeader, onConfirm]);

	return (
		<Popup onDismiss={onDismiss}>
			<View className={'flex flex-col gap-6'}>
				<Content size={'xs'} type={'title'} center>
					Edit Unit
				</Content>

				<EquipmentSelector
					member={member}
					equipment={equipment}
					setEquipment={setEquipment}
				/>

				{/*TODO: Fix max*/}
				<AmountSelector
					value={amount}
					onChange={(value) => {
						console.log(value);
						setAmount(value);
					}}
					max={3}
				/>

				<Button content={'Save'} onPress={onSave} />
			</View>
		</Popup>
	);
}
