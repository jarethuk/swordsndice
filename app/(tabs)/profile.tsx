import { faUpload } from '@awesome.me/kit-34e2017de2/icons/duotone/solid';
import { Image } from 'expo-image';
import { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import { useAPIUpdateUser } from '../../api/user/useAPIUpdateUser';
import { Content, FAIcon } from '../../components';
import { Alert } from '../../components/Alert';
import { Button } from '../../components/Button';
import { ErrorMessage } from '../../components/ErrorMessage';
import { Input } from '../../components/Input';
import { Page } from '../../components/Page';
import { useUser, useUserActions } from '../../states/useUserStore';

export default function Profile() {
  const user = useUser();
  const { setUser } = useUserActions();
  const [username, setUsername] = useState(user?.username ?? '');
  const [description, setDescription] = useState(user?.description ?? '');

  const { mutateAsync, error, isPending } = useAPIUpdateUser();
  const [showSuccess, setShowSuccess] = useState(false);

  const save = useCallback(async () => {
    if (!user) return;

    try {
      await mutateAsync({ username, description });

      setUser({
        ...user,
        username,
        description,
      });

      setShowSuccess(true);
    } catch {
      // Handled by hook
    }
  }, [description, mutateAsync, setUser, user, username]);

  useEffect(() => {
    if (showSuccess) setTimeout(() => setShowSuccess(false), 2000);
  }, [showSuccess]);

  if (!user) return null;

  return (
    <Page>
      <Content size={'md'} type={'title'} center>
        Profile
      </Content>

      <View className={'flex grow items-center'}>
        <View
          className={
            'bg-panel-light dark:bg-panel-dark flex h-40 w-40 items-center justify-center overflow-hidden rounded-full'
          }>
          {user.image ? (
            <Image source={user.image} style={{ height: 160, width: 160 }} />
          ) : (
            <View className={'flex flex-col items-center gap-4'}>
              <FAIcon icon={faUpload} size={36} />
            </View>
          )}
        </View>
      </View>

      <Input value={username} onChange={setUsername} type={'text'} label={'Username'} />
      <Input
        value={description}
        onChange={setDescription}
        type={'text'}
        label={'About You'}
        multiline
      />

      <ErrorMessage error={error} />

      {showSuccess && <Alert type={'success'} message={'Profile updated!'} />}

      <Button content={'Save'} loading={isPending} onPress={save} />
    </Page>
  );
}
