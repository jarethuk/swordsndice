import {View} from 'react-native';
import {Button} from '../Button';
import {Content} from '../Content';
import {Popup} from '../Popup';

interface Props {
	onDismiss: () => void;
	onConfirm: () => void;
	message: string;
}

export default function AreYouSurePopup({
	onDismiss,
	onConfirm,
	message,
}: Props) {
	return (
		<Popup onDismiss={onDismiss}>
			<View className={'flex flex-col gap-6'}>
				<Content size={'sm'} type={'title'} center>
					Are You Sure?
				</Content>

				<Content size={'sm'} type={'subtitle'} center>
					{message}
				</Content>

				<Button content={'Cancel'} onPress={onDismiss} variant={'outline'} />

				<Button content={'Confirm'} onPress={onConfirm} variant={'negative'} />
			</View>
		</Popup>
	);
}
