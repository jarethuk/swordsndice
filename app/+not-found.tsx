import { router } from 'expo-router';
import { View } from 'react-native';
import { Button } from '../components/common/Button';
import { Content } from '../components/common/Content';

export default function NotFoundScreen() {
	return (
		<View
			className={'flex grow flex-col items-center justify-center gap-6 p-12'}
		>
			<Content type={'title'} size={'md'}>
				Page Not Found
			</Content>

			<Button content={'Back'} onPress={() => router.back()} />
		</View>
	);
}
