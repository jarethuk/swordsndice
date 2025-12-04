import {View} from 'react-native';
import type {ListMember} from '../types/List';
import {Content} from './Content';

interface Props {
	member: ListMember;
}

export default function EquipmentList({ member }: Props) {
	return (
		<View className={'flex flex-col gap-2 mt-2'}>
			{member.equipment.map(({ name, points }) => (
				<Content type={'subtitle'} size={'xs'} muted>
					- {name} ({points}pts)
				</Content>
			))}
		</View>
	);
}
