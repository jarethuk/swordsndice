import {Stack, usePathname} from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import {useEffect} from 'react';
import '../global.css';
import {Nunito_500Medium, Nunito_600SemiBold, Nunito_700Bold, Nunito_800ExtraBold, Nunito_900Black, useFonts, } from '@expo-google-fonts/nunito';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {type Query, QueryClient} from '@tanstack/react-query';
import {PersistQueryClientProvider} from '@tanstack/react-query-persist-client';
import {clsx} from 'clsx';
import {StatusBar} from 'expo-status-bar';
import {Appearance, Platform, View} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaView, useSafeAreaInsets, } from 'react-native-safe-area-context';
import Toast, {type ToastShowParams} from 'react-native-toast-message';
import {useAPIMe} from '../api/auth/useAPIMe';
import {LoginForm} from '../components/auth/LoginForm';
import {UsernameForm} from '../components/auth/UsernameForm';
import {Content} from '../components/common/Content';
import {LoadingScreen} from '../components/common/LoadingScreen';
import {Page} from '../components/common/Page';
import {createQueryPersister} from '../helpers/QueryPersister';
import {StorageHelper} from '../helpers/StorageHelper';
import {useTheme, useThemeActions} from '../states/useThemeStore';
import {useUser, useUserActions} from '../states/useUserStore';
import type {PersistableQuery} from '../types/QueryMetadata';

void SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: false,
			refetchOnMount: false,
			refetchOnWindowFocus: false,
			refetchOnReconnect: false,
		},
	},
});

const persister = createQueryPersister();

const CustomToast = ({ type, text1 }: ToastShowParams) => {
	return (
		<SafeAreaView className={'w-full'}>
			<View className={'p-4'}>
				<View
					className={clsx('z-40 w-full rounded-2xl p-4', {
						'bg-secondary-light dark:bg-secondary-dark': type !== 'error',
						'bg-negative-light dark:bg-negative-dark': type === 'error',
					})}
				>
					<Content type={'subtitle'} size={'md'} center variant={'white'}>
						{text1}
					</Content>
				</View>
			</View>
		</SafeAreaView>
	);
};

const Layout = () => {
	const { data: apiUser, isLoading: userLoading } = useAPIMe();
	const user = useUser();
	const { setUser } = useUserActions();
	const { top, bottom } = useSafeAreaInsets();
	const pathname = usePathname();

  console.log(user)

	useEffect(() => {
		if (!userLoading && apiUser && user !== apiUser) {
			setUser(apiUser);
		}
	}, [apiUser, userLoading, setUser, user]);

	if (pathname.includes('auth')) {
		return (
			<Stack
				screenOptions={{
					headerShown: false,
				}}
			>
				<Stack.Screen name="auth/google" />
			</Stack>
		);
	}

	if (userLoading) {
		return (
			<View
				className={
					'bg-background-dark flex h-screen w-full flex-col items-center justify-center'
				}
			>
				<LoadingScreen message={'Initialising...'} />
			</View>
		);
	}

	if (!user) {
		return (
			<Page isDark>
				<View style={{ paddingTop: top, paddingBottom: bottom }}>
					<LoginForm />
				</View>
			</Page>
		);
	}

	if (!user.username) {
		return (
			<Page isDark>
				<View style={{ paddingTop: top, paddingBottom: bottom }}>
					<UsernameForm />
				</View>
			</Page>
		);
	}

	const presentation = Platform.OS === 'web' ? 'transparentModal' : 'modal';

	return (
		<Stack
			screenOptions={{
				headerShown: false,
			}}
		>
			<Stack.Screen
				name="modals/list-add-unit"
				options={{
					presentation,
				}}
			/>

			<Stack.Screen
				name="modals/list-add-warband"
				options={{
					presentation,
				}}
			/>

			<Stack.Screen
				name="modals/list-edit"
				options={{
					presentation,
				}}
			/>

			<Stack.Screen
				name="modals/list-edit-unit"
				options={{
					presentation,
				}}
			/>

			<Stack.Screen
				name="modals/select-game"
				options={{
					presentation,
				}}
			/>

			<Stack.Screen
				name="modals/select-army"
				options={{
					presentation,
				}}
			/>

			<Stack.Screen
				name="modals/select-list"
				options={{
					presentation,
				}}
			/>

			<Stack.Screen
				name="modals/game-edit"
				options={{
					presentation,
				}}
			/>

			<Stack.Screen
				name="modals/invite-to-game"
				options={{
					presentation,
				}}
			/>

			<Stack.Screen
				name="modals/set-game-list"
				options={{
					presentation,
				}}
			/>

			<Stack.Screen
				name="modals/create-group"
				options={{
					presentation,
				}}
			/>

			<Stack.Screen
				name="modals/edit-group"
				options={{
					presentation,
				}}
			/>

			<Stack.Screen
				name="modals/invite-to-group"
				options={{
					presentation,
				}}
			/>

			<Stack.Screen
				name="modals/notification-game-invite"
				options={{
					presentation,
				}}
			/>

			<Stack.Screen
				name="modals/notification-group-invite"
				options={{
					presentation,
				}}
			/>

			<Stack.Screen
				name="modals/group-invite"
				options={{
					presentation,
				}}
			/>

			<Stack.Screen
				name="modals/group-member"
				options={{
					presentation,
				}}
			/>

			<Stack.Screen
				name="modals/game-invite"
				options={{
					presentation,
				}}
			/>

			<Stack.Screen
				name="modals/game-finish"
				options={{
					presentation,
				}}
			/>
		</Stack>
	);
};

export default function RootLayout() {
	const [fontsLoaded] = useFonts({
		Nunito_500Medium,
		Nunito_600SemiBold,
		Nunito_700Bold,
		Nunito_800ExtraBold,
		Nunito_900Black,
		DINRoundPro: require('../assets/fonts/dinroundpro_bold.otf'),
	});

	const theme = useTheme();
	const { setTheme } = useThemeActions();
	const loaded = fontsLoaded;

	const pathname = usePathname();

	// Prevent users getting stuck in a modal when refreshing
	useEffect(() => {
		if (pathname.includes('modal')) window.location.href = '/';
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (!theme) {
			void StorageHelper.get<string>('theme').then((value) => {
				setTheme(
					(value as 'light' | 'dark') ?? Appearance.getColorScheme() ?? 'light',
				);
			});
		}
	}, [setTheme, theme]);

	useEffect(() => {
		if (loaded) {
			SplashScreen.hide();
		}
	}, [loaded]);

	if (!loaded) {
		return null;
	}

	return (
		<View
			className={`bg-background-light dark:bg-background-dark h-full w-full ${theme === 'dark' ? 'dark' : 'light'}`}
		>
			<GestureHandlerRootView>
				<PersistQueryClientProvider
					client={queryClient}
					persistOptions={{
						persister,
						dehydrateOptions: {
							shouldDehydrateMutation: () => false,
							shouldDehydrateQuery: (query: Query) =>
								query.state.status === 'success' &&
								!!(query as PersistableQuery).meta?.persist,
						},
					}}
				>
					<BottomSheetModalProvider>
						<StatusBar style="auto" />

						<Layout />

						<Toast
							config={{
								success: (props) => <CustomToast {...props} />,
								error: (props) => <CustomToast {...props} />,
							}}
						/>
					</BottomSheetModalProvider>
				</PersistQueryClientProvider>
			</GestureHandlerRootView>
		</View>
	);
}
