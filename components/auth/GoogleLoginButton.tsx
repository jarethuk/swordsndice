import { faGoogle } from '@awesome.me/kit-6b5fd61d92/icons/classic/brands';
import {
  GoogleSignin,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { useState } from 'react';
import { View } from 'react-native';
import { useAPIGoogleLogin } from '../../api/auth/useAPIGoogleLogin';
import { useUserActions } from '../../states/useUserStore';
import type { UserResponse } from '../../types/api/responses/UserResponse';
import { Button } from '../common/Button';
import { Content } from '../common/Content';
import { ErrorMessage } from '../common/ErrorMessage';
import { FAIcon } from '../common/FAIcon';

GoogleSignin.configure({
  iosClientId: '680803508827-fvfh2d9i04s4phicu7dchkm2jjpanitn.apps.googleusercontent.com',
});

export default function GoogleLoginButton() {
  const { mutateAsync, error: apiError } = useAPIGoogleLogin();
  const { setUser } = useUserActions();
  const [googleError, setGoogleError] = useState<string | undefined>();

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();

      if (isSuccessResponse(response)) {
        const user = await mutateAsync({
          token: response.data.idToken as string,
        });

        setUser(user as UserResponse);
      }
    } catch (error) {
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.IN_PROGRESS:
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            break;
          default:
            setGoogleError(error.message);
        }
      }
    }
  };

  return (
    <>
      <ErrorMessage message={googleError} error={apiError} />

      <Button
        variant={'outline'}
        themeOverride={'dark'}
        onPress={signIn}
        content={
          <View className={'flex flex-row items-center gap-4'}>
            <FAIcon icon={faGoogle} colour={'white'} size={24} />

            <Content type={'cta'} size={'lg'} themeOverride={'dark'}>
              Login with Google
            </Content>
          </View>
        }
      />
    </>
  );
}
