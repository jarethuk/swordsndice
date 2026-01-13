import { useQueryClient } from '@tanstack/react-query';
import { useColorScheme } from 'nativewind';
import { useCallback, useState } from 'react';
import { View } from 'react-native';
import { useAPILogout } from '../../api/auth/useAPILogout';
import { Content } from '../../components';
import { Button } from '../../components/Button';
import { Page } from '../../components/Page';
import Toggle from '../../components/Toggle';
import { useUserActions } from '../../states/useUserStore';

export default function Settings() {
  const { setColorScheme, colorScheme } = useColorScheme();
  const { refetch, isLoading: isLoggingOut } = useAPILogout();
  const { setUser } = useUserActions();
  const client = useQueryClient();

  const [isClearingCache, setIsClearingCache] = useState(false);

  const logout = useCallback(async () => {
    await refetch();
    await client.invalidateQueries();
    setUser(undefined);
  }, [client, refetch, setUser]);

  const clearCache = useCallback(async () => {
    setIsClearingCache(true);
    await client.invalidateQueries();
    setIsClearingCache(false);
  }, [client]);

  return (
    <Page title={'Settings'}>
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

      <Button content={'Clear Cache'} onPress={clearCache} loading={isClearingCache} />

      <Button content={'Logout'} onPress={logout} loading={isLoggingOut} />
    </Page>
  );
}
