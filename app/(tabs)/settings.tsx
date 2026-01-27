import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { View } from 'react-native';
import { useAPILogout } from '../../api/auth/useAPILogout';
import { Content } from '../../components';
import { Button } from '../../components/common/Button';
import { Page } from '../../components/common/Page';
import Toggle from '../../components/common/Toggle';
import { StorageHelper } from '../../helpers/StorageHelper';
import { useTheme, useThemeActions } from '../../states/useThemeStore';
import { useUserActions } from '../../states/useUserStore';

export default function Settings() {
  const theme = useTheme();
  const { setTheme } = useThemeActions();
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

  const toggleTheme = useCallback(async () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';

    setTheme(newTheme);
    await StorageHelper.set('theme', newTheme);
  }, [setTheme, theme]);

  return (
    <Page title={'Settings'}>
      <View className={'flex flex-row items-center'}>
        <Content size={'md'} type={'subtitle'}>
          Light mode
        </Content>

        <Toggle className={'ml-auto'} value={theme === 'light'} onChange={toggleTheme} />
      </View>

      <Button content={'Clear Cache'} onPress={clearCache} loading={isClearingCache} />

      <Button content={'Logout'} onPress={logout} loading={isLoggingOut} />
    </Page>
  );
}
