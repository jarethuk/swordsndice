import { faBell, faUser } from '@awesome.me/kit-6b5fd61d92/icons/duotone/solid';
import { router } from 'expo-router';
import { Image, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAPIGameInvites } from '../../api/games/useAPIGameInvites';
import { useAPIGroupInvites } from '../../api/groups/useAPIGroupInvites';
import { useUser } from '../../states/useUserStore';
import { Content } from './Content';
import { FAIcon } from './FAIcon';

export default function Header() {
	const { top } = useSafeAreaInsets();
	const user = useUser();

	const { data: gameInvites } = useAPIGameInvites();
	const { data: groupInvites } = useAPIGroupInvites();
	const count = (gameInvites?.length ?? 0) + (groupInvites?.length ?? 0);

	return (
		<View
			style={{
				paddingTop: Math.max(top, 24),
			}}
		>
			<View className={'flex w-full flex-row items-center px-6 pb-6'}>
				<Pressable
					className={'flex flex-row items-center gap-4'}
					onPress={() => router.navigate('/(tabs)/profile')}
				>
					<View className={'flex flex-row items-center gap-2'}>
						<View
							className={
								'bg-panel-light dark:bg-panel-dark flex h-[32] w-[32] items-center justify-center overflow-hidden rounded-full'
							}
						>
							{user?.image ? (
								<Image
									source={{
										uri: user.image,
									}}
									style={{ width: 32, height: 32, borderRadius: 16 }}
								/>
							) : (
								<FAIcon icon={faUser} size={12} />
							)}
						</View>

						<Content size={'xs'} type={'title'}>
							@{user?.username}
						</Content>
					</View>
				</Pressable>

				<Pressable
					className={'ml-auto flex flex-row items-center gap-1'}
					onPress={() =>
						router.navigate({
							pathname: '/(tabs)/notifications',
						})
					}
				>
					{count > 0 && (
						<Content size={'md'} type={'subtitle'} variant={'negative'}>
							{count}
						</Content>
					)}

					<FAIcon
						icon={faBell}
						size={20}
						colour={count > 0 ? 'negative' : 'muted'}
					/>
				</Pressable>
			</View>
		</View>
	);
}
