import {useColorScheme} from 'nativewind';
import {Animated, View} from 'react-native';
import {Content} from '../../components';
import Toggle from '../../components/Toggle';
import ScrollView = Animated.ScrollView;

export default function Settings() {
	const { setColorScheme, colorScheme } = useColorScheme();

	return (
		<ScrollView contentContainerClassName={'flex flex-col gap-6'}>
			<Content size={'md'} type={'title'} center>
				Settings
			</Content>

			<View className={'flex flex-row items-center'}>
				<Content size={'md'} type={'subtitle'}>
					Light mode
				</Content>

				<Toggle
					className={'ml-auto'}
					value={colorScheme === 'light'}
					onChange={() => {
						setColorScheme(colorScheme === 'dark' ? 'light' : 'dark');
					}}
				/>
			</View>
		</ScrollView>
	);
}
