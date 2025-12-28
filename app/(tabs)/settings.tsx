import { useColorScheme } from 'nativewind';
import { useCallback } from 'react';
import { Animated, View } from 'react-native';
import { useAPILogout } from '../../api/auth/useAPILogout';
import { Content } from '../../components';
import { Button } from '../../components/Button';
import Toggle from '../../components/Toggle';
import { useUserActions } from '../../states/useUserStore';
import ScrollView = Animated.ScrollView;

export default function Settings() {
  const { setColorScheme, colorScheme } = useColorScheme();
  const { refetch, isLoading: isLoggingOut } = useAPILogout();
  const { setUser } = useUserActions();

  const logout = useCallback(async () => {
    await refetch();
    setUser(undefined);
  }, [refetch, setUser]);

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

      <Button content={'Logout'} onPress={logout} loading={isLoggingOut} />
    </ScrollView>
  );
}
