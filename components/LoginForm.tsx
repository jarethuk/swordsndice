import { faApple, faGoogle } from '@awesome.me/kit-34e2017de2/icons/classic/brands';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Image } from 'expo-image';
import { useCallback, useState } from 'react';
import { View } from 'react-native';
import { useAPILogin } from '../api/auth/useAPILogin';
import { useUserActions } from '../states/useUserStore';
import type { UserResponse } from '../types/api/responses/UserResponse';
import { Button } from './Button';
import { CodeEnterInput } from './CodeEnterInput';
import { Content } from './Content';
import Divider from './Divider';
import { ErrorMessage } from './ErrorMessage';
import { Input } from './Input';

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const { mutateAsync, error } = useAPILogin();
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { setUser } = useUserActions();

  const sendOTP = useCallback(async () => {
    if (isSendingCode) return;

    setIsSendingCode(true);

    try {
      await mutateAsync({ email });
      setEmailSent(true);
    } catch {
      // Handled by hook
    }

    setIsSendingCode(false);
  }, [mutateAsync, email, isSendingCode]);

  const login = useCallback(
    async (code: string) => {
      if (isLoggingIn) return;

      setIsLoggingIn(true);

      try {
        const user = await mutateAsync({ email, code });
        setUser(user as UserResponse);
      } catch {
        // Handled by hook
      }

      setIsLoggingIn(false);
    },
    [isLoggingIn, mutateAsync, email, setUser]
  );

  return (
    <View className={'bg-background-dark flex gap-6 p-6'}>
      <View className={'mt-12 flex items-center gap-6'}>
        <Image
          source={require('../assets/logo.png')}
          style={{ width: 100, height: 150, alignSelf: 'center' }}
        />

        <Content type={'display'} size={'sm'} center themeOverride={'dark'}>
          Swords & Dice
        </Content>
      </View>

      {emailSent ? (
        <View className={'flex flex-col gap-6'}>
          <Content type={'subtitle'} size={'md'} center themeOverride={'dark'}>
            Enter the code sent to your email address
          </Content>

          <CodeEnterInput onComplete={(code) => login(code)} length={6} />

          <ErrorMessage error={error} />
        </View>
      ) : (
        <View className={'flex gap-8'}>
          <View className={'flex gap-6'}>
            <Content type={'subtitle'} size={'md'} center themeOverride={'dark'}>
              Enter your email address to get started
            </Content>

            <Input
              value={email}
              onChange={setEmail}
              type={'text'}
              label={'Email'}
              themeOverride={'dark'}
            />

            <ErrorMessage error={error} />

            <Button
              content={'Continue'}
              loading={isSendingCode}
              onPress={sendOTP}
              themeOverride={'dark'}
            />
          </View>

          <Divider />

          <View className={'flex items-center justify-center gap-4'}>
            <Button
              variant={'outline'}
              themeOverride={'dark'}
              content={
                <View className={'flex flex-row items-center gap-4'}>
                  <FontAwesomeIcon icon={faApple} color={'white'} size={24} />

                  <Content type={'cta'} size={'lg'} themeOverride={'dark'}>
                    Login with Apple
                  </Content>
                </View>
              }
            />

            <Button
              variant={'outline'}
              themeOverride={'dark'}
              content={
                <View className={'flex flex-row items-center gap-4'}>
                  <FontAwesomeIcon icon={faGoogle} color={'white'} size={24} />

                  <Content type={'cta'} size={'lg'} themeOverride={'dark'}>
                    Login with Google
                  </Content>
                </View>
              }
            />
          </View>
        </View>
      )}
    </View>
  );
};
