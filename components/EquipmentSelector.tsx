import {useCallback, useMemo} from 'react';
import {View} from 'react-native';
import {MESBGProfiles} from '../data/MESBGProfiles';
import type {ListMemberEquipment} from '../types/List';
import type {Equipment} from '../types/Profile';
import {Content} from './Content';
import Toggle from './Toggle';

interface Props {
	member: { name: string };
	equipment: ListMemberEquipment[];
	setEquipment: (selected: ListMemberEquipment[]) => void;
}

export default function EquipmentSelector({
	member,
	equipment,
	setEquipment,
}: Props) {
	const profile = useMemo(() => {
		return MESBGProfiles.find((x) => x.name === member.name);
	}, [member]);

	const onChange = useCallback(
		(changed: Equipment) => {
			const index = equipment.findIndex((x) => x.name === changed.name);

			if (index >= 0) {
				const newSelected = [...equipment];
				newSelected.splice(index, 1);
				setEquipment(newSelected);
			} else {
				setEquipment([...equipment, changed]);
			}
		},
		[equipment],
	);

	if (!profile) return;

	return (
		<>
			{profile?.equipment?.map((item) => (
				<View key={item.name} className={'flex flex-row items-center gap-4'}>
					<Content size={'md'} type={'subtitle'}>
						{item.name} ({item.points}pts)
					</Content>

					<Toggle
						className={'ml-auto'}
						value={!!equipment.find((x) => x.name === item.name)}
						onChange={() => onChange(item)}
					/>
				</View>
			))}
		</>
	);
}
