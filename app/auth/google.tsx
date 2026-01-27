import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect } from 'react';
import { View } from 'react-native';
import { useAPIGoogleLogin } from '../../api/auth/useAPIGoogleLogin';
import { Content } from '../../components';
import { Button } from '../../components/common/Button';
import { LoadingScreen } from '../../components/common/LoadingScreen';
import { useUserActions } from '../../states/useUserStore';
import type { UserResponse } from '../../types/api/responses/UserResponse';

const forceRefresh = () => {
  window.location.href = window.location.origin;
};

export default function GoogleCallback() {
  const { mutateAsync, error } = useAPIGoogleLogin();
  const { code } = useLocalSearchParams();
  const { setUser } = useUserActions();

  const checkCode = useCallback(async () => {
    if (!code) {
      forceRefresh();
      return;
    }

    try {
      const user = await mutateAsync({
        code: code as string,
      });

      setUser(user as UserResponse);

      router.navigate('/(tabs)');
    } catch {
      // Handled by hook
    }
  }, [code, mutateAsync, setUser]);

  useEffect(() => {
    void checkCode();
  }, [checkCode]);

  if (error) {
    return (
      <View
        className={'bg-background-dark flex h-screen w-full flex-col items-center justify-center'}>
        <View className={'flex h-full grow flex-col items-center justify-center gap-6'}>
          <Content type={'title'} size={'md'}>
            Failed to login with Google
          </Content>
          <Button content={'Back to Login'} onPress={forceRefresh} />
        </View>
      </View>
    );
  }

  return (
    <View
      className={'bg-background-dark flex h-screen w-full flex-col items-center justify-center'}>
      <LoadingScreen message={'Checking your Google login...'} />
    </View>
  );
}
