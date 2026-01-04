import { faUser } from '@awesome.me/kit-34e2017de2/icons/duotone/solid';
import { useQueryClient } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';
import { useCallback } from 'react';
import { Animated } from 'react-native';
import { useAPIAddFriend } from '../../api/friends/useAPIAddFriend';
import { useAPIRemoveFriend } from '../../api/friends/useAPIRemoveFriend';
import { useAPIGetUser } from '../../api/user/useAPIGetUser';
import { Button } from '../../components/Button';
import { LoadingScreen } from '../../components/LoadingScreen';

import { PageTitleWithImage } from '../../components/PageTitleWithImage';
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
      <PageTitleWithImage title={data.username} placeholderIcon={faUser} image={data.image} />

      {data.isFriend ? (
        <Button content={'Remove Friend'} onPress={removeFriend} />
      ) : (
        <Button content={'Add Friend'} onPress={addFriend} />
      )}
    </ScrollView>
  );
}
