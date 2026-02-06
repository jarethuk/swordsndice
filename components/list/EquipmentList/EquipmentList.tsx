import { View } from 'react-native';
import type { ListMember } from '../../../types/api/ListBody';
import { Content } from '../../common/Content';

interface Props {
	member: ListMember;
}

export default function EquipmentList({ member }: Props) {
	if (member.equipment.length === 0) return;

	return (
		<View className={'mt-2 flex flex-col gap-2'}>
			{member.equipment.map(({ name, points }) => (
				<Content type={'subtitle'} size={'xs'} muted key={name}>
					{name} ({points}pts)
				</Content>
			))}
		</View>
	);
}
