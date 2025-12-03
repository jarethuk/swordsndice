import {View} from 'react-native';
import {type Games, GamesList} from '../../types';
import {Content} from '../Content';
import {Popup} from '../Popup';
import {PopupRow} from '../PopupRow';

interface Props {
	onDismiss: () => void;
	onSelect: (game: Games) => void;
}

export default function SelectGamePopup({ onSelect, onDismiss }: Props) {
	return (
		<Popup onDismiss={onDismiss}>
			<View className={'flex flex-col gap-4'}>
				<Content size={'xs'} type={'title'} center>
					Select Game
				</Content>

				{GamesList.map(({ title, value }) => (
					<PopupRow key={value} title={title} onPress={() => onSelect(value)} />
				))}
			</View>
		</Popup>
	);
}
