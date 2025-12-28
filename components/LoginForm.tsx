import { faApple, faGoogle, } from '@awesome.me/kit-34e2017de2/icons/classic/brands';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Image } from 'expo-image';
import { useCallback, useState } from 'react';
import { Animated, View } from 'react-native';
import { useAPILogin } from '../api/auth/useAPILogin';
import { useUserActions } from '../states/useUserStore';
import type { UserResponse } from '../types/api/responses/UserResponse';
import { Button } from './Button';
import { Content } from './Content';
import Divider from './Divider';
import { Input } from './Input';
import ScrollView = Animated.ScrollView;

export const LoginForm = () => {
  const [email, setEmail] = useState('ben.j.cresswell@live.co.uk');
  const [code, setCode] = useState('');
  const { mutateAsync } = useAPILogin();
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { setUser } = useUserActions();

  const sendOTP = useCallback(async () => {
    if (isSendingCode) return;

    setIsSendingCode(true);

    await mutateAsync({ email });

    setIsSendingCode(false);
    setEmailSent(true);
  }, [mutateAsync, email, isSendingCode]);

  const login = useCallback(async () => {
    if (isLoggingIn) return;

    setIsLoggingIn(true);

    const user = await mutateAsync({ email, code });
    setUser(user as UserResponse);
  }, [isLoggingIn, mutateAsync, email, code, setUser]);

  return (
    <ScrollView
      contentContainerClassName={'p-4 flex gap-12 h-full bg-background-dark'}
      automaticallyAdjustKeyboardInsets={true}>
      <View className={'my-12 flex items-center justify-center gap-4'}>
        <Image
          source={require('../assets/logo.png')}
          style={{ width: 100, height: 150, alignSelf: 'center' }}
        />

        <Content type={'display'} size={'sm'} center>
          Swords & Dice
        </Content>
      </View>

      {emailSent ? (
        <View className={'flex flex-col gap-6'}>
          <Content type={'subtitle'} size={'md'} center>
            Enter the code sent to your email address
          </Content>

          <Input value={code} onChange={setCode} type={'numeric'} label={'Code'} />

          <Button content={'Continue'} loading={isLoggingIn} onPress={login} />
        </View>
      ) : (
        <View className={'flex gap-12'}>
          <View className={'flex gap-6'}>
            <Content type={'subtitle'} size={'md'} center>
              Enter your email address to get started
            </Content>

            <Input value={email} onChange={setEmail} type={'text'} label={'Email'} />

            <Button content={'Continue'} loading={isSendingCode} onPress={sendOTP} />
          </View>

          <Divider />

          <View className={'flex items-center justify-center gap-4'}>
            <Button
              variant={'outline'}
              content={
                <View className={'flex flex-row items-center gap-4'}>
                  <FontAwesomeIcon icon={faApple} color={'white'} size={24} />

                  <Content type={'cta'} size={'lg'}>
                    Login with Apple
                  </Content>
                </View>
              }
            />

            <Button
              variant={'outline'}
              content={
                <View className={'flex flex-row items-center gap-4'}>
                  <FontAwesomeIcon icon={faGoogle} color={'white'} size={24} />

                  <Content type={'cta'} size={'lg'}>
                    Login with Google
                  </Content>
                </View>
              }
            />
          </View>
        </View>
      )}
    </ScrollView>
  );
};
