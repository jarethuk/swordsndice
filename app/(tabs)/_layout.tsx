import { faClock, faCog, faList, faSwords, faUsers, } from '@awesome.me/kit-34e2017de2/icons/duotone/solid';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { clsx } from 'clsx';
import { router, Tabs } from 'expo-router';
import type { ReactElement } from 'react';
import { Pressable, View } from 'react-native';
import Header from '../../components/Header';
import { useColours } from '../../hooks/useColours';

const tabRoutes = ['lists', 'index', 'feed', 'social', 'settings'];

function getIcon(route: string, colour: string): ReactElement {
	switch (route) {
		case 'lists':
			return <FontAwesomeIcon icon={faList} size={26} color={colour} />;
		case 'feed':
			return <FontAwesomeIcon icon={faClock} size={26} color={colour} />;
		case 'social':
			return <FontAwesomeIcon icon={faUsers} size={26} color={colour} />;
		case 'settings':
			return <FontAwesomeIcon icon={faCog} size={26} color={colour} />;
		default:
			return <FontAwesomeIcon icon={faCog} size={26} color={colour} />;
	}
}

function TabsBar(props: BottomTabBarProps) {
	const colours = useColours();

	return (
		<View
			className={
				'border-border-light dark:border-border-dark bg-bottom-bar-light dark:bg-bottom-bar-dark relative flex flex-row items-center justify-center gap-8 border-t-2 pb-4'
			}
		>
			{props.state.routes
				.filter((x) => tabRoutes.includes(x.name ?? ''))
				.map((route, i) => {
					const active = props.state.index === i;

					if (route.name === 'index') {
						return (
							<View className={'relative h-20 w-24'} key={'index'}>
								<View
									key={i.toString()}
									className={
										'bg-background-light dark:bg-background-dark absolute rounded-full p-1 -top-5'
									}
								>
									<Pressable
										onPress={() => router.navigate('/')}
										className={
											'rounded-full bg-purple-600 pb-1 active:mt-1 active:pb-0'
										}
									>
										<View
											className={
												'h-20 w-20 overflow-hidden rounded-full bg-purple-500'
											}
										>
											<View
												className={'flex h-full items-center justify-center'}
											>
												<FontAwesomeIcon
													icon={faSwords}
													size={32}
													color="white"
												/>
											</View>
										</View>
									</Pressable>
								</View>
							</View>
						);
					}

					const colour = active ? colours.primary : colours.muted;

					return (
						<Pressable
							className={'mt-4 mb-4 flex flex-col gap-2'}
							key={i.toString()}
							onPress={() => {
								if (props.state.index !== i) {
									router.navigate(
										route.name === 'index' ? '/' : (route.name as any),
									);
								}
							}}
						>
							{getIcon(route.name, colour)}

							<View
								className={clsx('h-0.5 rounded-full', {
									'bg-purple-500': active,
								})}
							/>
						</Pressable>
					);
				})}
		</View>
	);
}

export default function TabLayout() {
	const colours = useColours();

	return (
		<View
			className={
				'bg-background-light dark:bg-background-dark flex h-full flex-col'
			}
		>
			<Header />

			<Tabs
				screenOptions={{
					headerShown: false,
					animation: 'shift',
					sceneStyle: {
						backgroundColor: colours.background,
						paddingLeft: 24,
						paddingRight: 24,
					},
				}}
				tabBar={(props) => <TabsBar {...props} />}
				initialRouteName={'index'}
			>
				<Tabs.Screen name="lists" />
				<Tabs.Screen name="social" />
				<Tabs.Screen name="index" />
				<Tabs.Screen name="feed" />
				<Tabs.Screen name="settings" />
			</Tabs>
		</View>
	);
}
