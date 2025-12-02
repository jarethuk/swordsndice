import { Stack } from 'expo-router';
import { Content } from '../components';

export default function NotFoundScreen() {
	return (
		<>
			<Stack.Screen options={{ title: 'Oops!' }} />

			<Content>Page not found</Content>
		</>
	);
}
