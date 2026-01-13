import BadWords from 'bad-words';
import { Image } from 'expo-image';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import { useAPIUpdateUser } from '../api/user/useAPIUpdateUser';
import { useUser, useUserActions } from '../states/useUserStore';
import { Alert } from './Alert';
import { Button } from './Button';
import { Content } from './Content';
import { ErrorMessage } from './ErrorMessage';
import { Input } from './Input';

const badWords = new BadWords();

export const UsernameForm = () => {
  const [username, setUsername] = useState('');
  const user = useUser();
  const { setUser } = useUserActions();
  const [hasBlurred, setHasBlurred] = useState(false);

  const sanitisedUsername = useMemo(() => {
    const match = username.match(/^[A-Za-z]+/);

    if (!match || !match.length) return '';

    return match[0].toLowerCase().trim();
  }, [username]);

  const isProfaneUsername = useMemo(() => {
    return badWords.isProfane(sanitisedUsername);
  }, [sanitisedUsername]);

  const isTooShort = sanitisedUsername.length < 4;
  const isValid = !isProfaneUsername && !isTooShort;

  const { mutate, isPending, isSuccess, error } = useAPIUpdateUser();

  useEffect(() => {
    if (isSuccess && user) {
      setUser({
        ...user,
        username: sanitisedUsername,
      });
    }
  }, [isSuccess, sanitisedUsername, user, setUser]);

  const save = useCallback(() => {
    mutate({ username: sanitisedUsername });
  }, [sanitisedUsername, mutate]);

  return (
    <View className={'bg-background-dark flex h-full gap-12 p-4'}>
      <View className={'mt-12 flex items-center gap-6'}>
        <Image
          source={require('../assets/logo.png')}
          style={{ width: 100, height: 150, alignSelf: 'center' }}
        />

        <Content type={'display'} size={'sm'} center themeOverride={'dark'}>
          Swords & Dice
        </Content>

        <Content type={'subtitle'} size={'lg'} center themeOverride={'dark'}>
          Choose a username
        </Content>

        <Content type={'body'} size={'md'} center themeOverride={'dark'}>
          This username allows others to find you for games. It is publicly visible so be sensible.
        </Content>
      </View>

      <View className={'flex flex-col gap-4'}>
        <Input
          value={username}
          onChange={setUsername}
          type={'text'}
          label={'Username'}
          themeOverride={'dark'}
          onBlur={() => setHasBlurred(true)}
        />

        <Content type={'body'} size={'md'} center muted themeOverride={'dark'}>
          Your username will be visible to other players
        </Content>

        {username.toLowerCase() !== sanitisedUsername && (
          <Alert type={'info'} message={`Actual username will be: @${sanitisedUsername}`} />
        )}

        {isProfaneUsername && (
          <Content type={'body'} size={'md'} center variant={'negative'} themeOverride={'dark'}>
            Keep it clean please!
          </Content>
        )}

        {isTooShort && hasBlurred && (
          <Content type={'body'} size={'md'} center variant={'negative'} themeOverride={'dark'}>
            Must be at least 4 characters long
          </Content>
        )}
      </View>

      <ErrorMessage error={error} />

      <Button
        content={'Continue'}
        disabled={!isValid}
        loading={isPending}
        onPress={save}
        themeOverride={'dark'}
      />
    </View>
  );
};
