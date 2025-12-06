import {router} from 'expo-router';
import {View} from 'react-native';
import {Content} from '../components';
import {Button} from '../components/Button';

export default function NotFoundScreen() {
	return (
		<View
			className={'flex flex-col grow justify-center items-center p-12 gap-6'}
		>
			<Content type={'title'} size={'md'}>
				Page Not Found
			</Content>
			<Button content={'Back'} onPress={() => router.back()} />
		</View>
	);
}
