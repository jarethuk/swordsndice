import { faBell } from '@awesome.me/kit-34e2017de2/icons/duotone/solid';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { router } from 'expo-router';
import { Image, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAPIGameInvites } from '../api/games/useAPIGameInvites';
import { useColours } from '../hooks/useColours';
import { useUser } from '../states/useUserStore';
import { Content } from './Content';

export default function Header() {
  const { top } = useSafeAreaInsets();
  const colours = useColours();
  const user = useUser();

  const { data: gameInvites } = useAPIGameInvites();

  const count = gameInvites?.length ?? 0;

  return (
    <View style={{ paddingTop: top, backgroundColor: colours.background }}>
      <View className={'flex w-full flex-row items-center px-6 pb-6'}>
        <Pressable className={'flex flex-row items-center gap-4'}>
          <View className={'flex flex-row items-center gap-2'}>
            <Image
              source={require('../assets/temp/profile.png')}
              style={{ width: 32, height: 32, borderRadius: 16 }}
            />

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
          }>
          {count > 0 && (
            <Content size={'md'} type={'subtitle'} variant={'negative'}>
              {count}
            </Content>
          )}

          <FontAwesomeIcon
            icon={faBell}
            size={20}
            color={count > 0 ? colours.negative : colours.muted}
          />
        </Pressable>
      </View>
    </View>
  );
}
