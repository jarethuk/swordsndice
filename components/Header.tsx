import {faBell} from '@awesome.me/kit-34e2017de2/icons/duotone/solid';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {Image, Pressable, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useColours} from '../hooks/useColours';
import {Content} from './Content';

export default function Header() {
	const { top } = useSafeAreaInsets();
	const colours = useColours();

	return (
		<View style={{ paddingTop: top, backgroundColor: colours.background }}>
			<View className={'flex flex-row items-center w-full pb-6 px-6'}>
				<Pressable className={'flex flex-row gap-4 items-center'}>
					<View className={'flex flex-row gap-2 items-center'}>
						<Image
							source={require('../assets/temp/profile.png')}
							style={{ width: 32, height: 32, borderRadius: 16 }}
						/>

						<Content size={'xs'} type={'title'}>
							@jarethuk
						</Content>
					</View>
				</Pressable>

				<Pressable className={'flex flex-row gap-4 items-center ml-auto'}>
					<FontAwesomeIcon icon={faBell} size={20} color={colours.muted} />
				</Pressable>
			</View>
		</View>
	);
}
