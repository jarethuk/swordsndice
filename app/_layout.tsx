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
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast, { type ToastShowParams } from 'react-native-toast-message';
import { useAPIMe } from '../api/auth/useAPIMe';
import { Content } from '../components';
import { LoadingScreen } from '../components/LoadingScreen';
import { LoginForm } from '../components/LoginForm';
import { UsernameForm } from '../components/UsernameForm';
import { createQueryPersister } from '../helpers/QueryPersister';
import { useColours } from '../hooks/useColours';
import { useUser, useUserActions } from '../states/useUserStore';
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
          className={clsx('z-40 w-full rounded-2xl p-4', {
            'bg-secondary-light dark:bg-secondary-dark': type !== 'error',
            'bg-negative-light dark:bg-negative-dark': type === 'error',
          })}>
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
  const colours = useColours();
  const { top, bottom } = useSafeAreaInsets();

  useEffect(() => {
    if (!userLoading && apiUser && user !== apiUser) {
      setUser(apiUser);
    }
  }, [apiUser, userLoading, setUser, user]);

  if (userLoading) {
    return (
      <View
        className={
          'bg-background-light dark:bg-background-dark flex h-screen w-full flex-col items-center justify-center'
        }>
        <LoadingScreen message={'Initialising...'} />
      </View>
    );
  }

  if (!user) {
    return (
      <View className={'bg-background-light dark:bg-background-dark flex h-full flex-col'}>
        <View style={{ paddingTop: top, paddingBottom: bottom }}>
          <LoginForm />
        </View>
      </View>
    );
  }

  if (!user.username) {
    return (
      <View className={'bg-background-light dark:bg-background-dark flex h-full flex-col'}>
        <View style={{ paddingTop: top, paddingBottom: bottom }}>
          <UsernameForm />
        </View>
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colours.background },
      }}>
      <Stack.Screen
        name="modals/list-add-unit"
        options={{
          presentation: 'modal',
        }}
      />

      <Stack.Screen
        name="modals/list-add-warband"
        options={{
          presentation: 'modal',
        }}
      />

      <Stack.Screen
        name="modals/list-edit"
        options={{
          presentation: 'modal',
        }}
      />

      <Stack.Screen
        name="modals/list-edit-unit"
        options={{
          presentation: 'modal',
        }}
      />

      <Stack.Screen
        name="modals/select-game"
        options={{
          presentation: 'modal',
        }}
      />

      <Stack.Screen
        name="modals/select-army"
        options={{
          presentation: 'modal',
        }}
      />

      <Stack.Screen
        name="modals/select-list"
        options={{
          presentation: 'modal',
        }}
      />

      <Stack.Screen
        name="modals/game-edit"
        options={{
          presentation: 'modal',
        }}
      />

      <Stack.Screen
        name="modals/invite-to-game"
        options={{
          presentation: 'modal',
        }}
      />

      <Stack.Screen
        name="modals/set-game-list"
        options={{
          presentation: 'modal',
        }}
      />

      <Stack.Screen
        name="modals/create-group"
        options={{
          presentation: 'modal',
        }}
      />

      <Stack.Screen
        name="modals/edit-group"
        options={{
          presentation: 'modal',
        }}
      />

      <Stack.Screen
        name="modals/invite-to-group"
        options={{
          presentation: 'modal',
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

  const loaded = fontsLoaded;

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
              query.state.status === 'success' && !!(query as PersistableQuery).meta?.persist,
          },
        }}>
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
  );
}
