import {
  faClock,
  faCog,
  faList,
  faSwords,
  faUsers,
} from '@awesome.me/kit-6b5fd61d92/icons/duotone/solid';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { clsx } from 'clsx';
import { router, Tabs } from 'expo-router';
import type { ReactElement } from 'react';
import { Platform, Pressable, View } from 'react-native';
import { FAIcon } from '../../components/common/FAIcon';
import Header from '../../components/common/Header';

const tabRoutes = ['index', 'lists', 'feed', 'social', 'settings'];

function getIcon(route: string, colour: 'primary' | 'muted'): ReactElement {
  switch (route) {
    case 'lists':
      return <FAIcon icon={faList} size={26} colour={colour} />;
    case 'feed':
      return <FAIcon icon={faClock} size={26} colour={colour} />;
    case 'social':
      return <FAIcon icon={faUsers} size={26} colour={colour} />;
    case 'settings':
      return <FAIcon icon={faCog} size={26} colour={colour} />;
    default:
      return <FAIcon icon={faCog} size={26} colour={colour} />;
  }
}

function TabsBar(props: BottomTabBarProps) {
  const isWeb = Platform.OS === 'web';

  return (
    <View
      className={clsx(
        'border-border-light dark:border-border-dark bg-bottom-bar-light dark:bg-bottom-bar-dark relative flex flex-row items-center justify-center gap-8 border-t-2',
        {
          'pb-4': !isWeb,
        }
      )}>
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
                    'bg-background-light dark:bg-background-dark absolute -top-5 rounded-full p-1'
                  }>
                  <Pressable
                    onPress={() => router.navigate('/')}
                    className={'rounded-full bg-purple-600 pb-1 active:mt-1 active:pb-0'}>
                    <View className={'h-20 w-20 overflow-hidden rounded-full bg-purple-500'}>
                      <View className={'flex h-full items-center justify-center'}>
                        <FAIcon icon={faSwords} size={32} colour="white" />
                      </View>
                    </View>
                  </Pressable>
                </View>
              </View>
            );
          }

          const colour: 'primary' | 'muted' = active ? 'primary' : 'muted';

          return (
            <Pressable
              className={'mt-4 mb-4 flex flex-col gap-2'}
              key={i.toString()}
              onPress={() => {
                if (props.state.index !== i) {
                  router.navigate(route.name === 'index' ? '/' : (route.name as any));
                }
              }}>
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
  return (
    <View className={'bg-background-light dark:bg-background-dark flex h-full w-full'}>
      <Header />

      <Tabs
        screenOptions={{
          headerShown: false,
          animation: 'shift',
          sceneStyle: {
            backgroundColor: 'transparent',
            paddingLeft: 24,
            paddingRight: 24,
          },
        }}
        tabBar={(props) => <TabsBar {...props} />}
        initialRouteName={'index'}
        backBehavior="history">
        <Tabs.Screen name="lists" />
        <Tabs.Screen name="social" />
        <Tabs.Screen name="index" />
        <Tabs.Screen name="feed" />
        <Tabs.Screen name="settings" />
        <Tabs.Screen
          name="game"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="list"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="create-list"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="friend"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="group"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="notifications"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            href: null,
          }}
        />
      </Tabs>
    </View>
  );
}
