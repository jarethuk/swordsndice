import { faUser } from '@awesome.me/kit-34e2017de2/icons/duotone/solid';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useQueryClient } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import { useCallback } from 'react';
import { Animated, View } from 'react-native';
import { useAPIAddFriend } from '../../api/friends/useAPIAddFriend';
import { useAPIRemoveFriend } from '../../api/friends/useAPIRemoveFriend';
import { useAPIGetUser } from '../../api/user/useAPIGetUser';
import { Content } from '../../components';
import { Button } from '../../components/Button';
import { LoadingScreen } from '../../components/LoadingScreen';
import ScrollView = Animated.ScrollView;

export default function FriendPage() {
  const { username } = useLocalSearchParams();
  const { data, refetch } = useAPIGetUser(username as string);
  const client = useQueryClient();

  const { mutateAsync: addFriendAsync } = useAPIAddFriend();
  const { mutateAsync: removeFriendAsync } = useAPIRemoveFriend();

  const addFriend = useCallback(async () => {
    if (!data) return;

    await addFriendAsync({
      friendId: data.id,
    });

    await refetch();

    await client.invalidateQueries({
      queryKey: ['friends'],
    });
  }, [addFriendAsync, client, data, refetch]);

  const removeFriend = useCallback(async () => {
    if (!data) return;

    await removeFriendAsync({
      friendId: data.id,
    });

    await refetch();

    await client.invalidateQueries({
      queryKey: ['friends'],
    });
  }, [data, removeFriendAsync, refetch, client]);

  if (!data) {
    return <LoadingScreen message={'Loading profile...'} />;
  }

  return (
    <ScrollView contentContainerClassName={'flex flex-col gap-6'}>
      <View className={'mt-6 mb-3 flex w-full flex-col items-center gap-4'}>
        <View
          className={
            'bg-panel-light dark:bg-panel-dark flex h-40 w-40 items-center justify-center overflow-hidden rounded-full'
          }>
          {data.image ? (
            <Image source={data.image} style={{ height: 160, width: 160 }} />
          ) : (
            <View className={'flex flex-col items-center gap-4'}>
              <FontAwesomeIcon icon={faUser} size={36} />
            </View>
          )}
        </View>

        <View className={'items-center'}>
          <Content type={'display'} size={'sm'} center>
            {data.username}
          </Content>
        </View>
      </View>

      {data.isFriend ? (
        <Button content={'Remove Friend'} onPress={removeFriend} />
      ) : (
        <Button content={'Add Friend'} onPress={addFriend} />
      )}
    </ScrollView>
  );
}
