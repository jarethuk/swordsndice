import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import '../global.css';
import {
	Nunito_500Medium,
	Nunito_600SemiBold,
	Nunito_700Bold,
	Nunito_800ExtraBold,
	Nunito_900Black,
	useFonts,
} from '@expo-google-fonts/nunito';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { type Query, QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { clsx } from 'clsx';
import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast, { type ToastShowParams } from 'react-native-toast-message';
import { Content } from '../components';
import { createQueryPersister } from '../helpers/QueryPersister';
import type { PersistableQuery } from '../types';

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
					className={clsx('w-full rounded-2xl p-4 z-40', {
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

export default function RootLayout() {
	const [fontsLoaded] = useFonts({
		Nunito_500Medium,
		Nunito_600SemiBold,
		Nunito_700Bold,
		Nunito_800ExtraBold,
		Nunito_900Black,
		DINRoundPro: require('../assets/fonts/dinroundpro_bold.otf'),
	});

	const loaded = fontsLoaded;
	const user = 1;

	useEffect(() => {
		if (loaded) {
			SplashScreen.hide();
		}
	}, [loaded]);

	if (!loaded) {
		return null;
	}

	return (
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

					{user ? (
						<Stack
							screenOptions={{
								headerShown: false,
							}}
						/>
					) : (
						<Text>Test</Text>
					)}

					<Toast
						config={{
							success: (props) => <CustomToast {...props} />,
							error: (props) => <CustomToast {...props} />,
						}}
					/>
				</BottomSheetModalProvider>
			</PersistQueryClientProvider>
		</GestureHandlerRootView>
	);
}
