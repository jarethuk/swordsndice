import { useQueryClient } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useMemo } from 'react';
import { View } from 'react-native';
import { useAPICancelGameInvite } from '../../api/games/useAPICancelGameInvite';
import { useAPIGame } from '../../api/games/useAPIGame';
import { Button } from '../../components/Button';
import { Dialog } from '../../components/Dialog';
import { LoadingScreen } from '../../components/LoadingScreen';

export default function GameInviteDialog() {
  const { id, gameId } = useLocalSearchParams();
  const { data, isLoading } = useAPIGame(gameId as string);

  const invite = useMemo(() => {
    return data?.invites?.find((x) => x.id === id);
  }, [data, id]);

  const client = useQueryClient();

  const { mutateAsync: apiCancelInvite } = useAPICancelGameInvite(id as string);

  const cancelInvite = useCallback(async () => {
    if (!invite) return;

    await apiCancelInvite({
      friendId: id as string,
    });

    await client.invalidateQueries({
      queryKey: ['game', gameId],
    });

    router.dismiss();
  }, [apiCancelInvite, client, gameId, id, invite]);

  if (isLoading) return <LoadingScreen message={'Loading game invite...'} />;

  if (!invite) return null;

  return (
    <Dialog title={'Manage Invite'} subtitle={`@${invite.username}`}>
      <View className={'flex flex-col items-center gap-4 md:flex-row'}>
        <View className={'grow'}>
          <Button content={'Cancel Invite'} onPress={cancelInvite} variant={'outline'} />
        </View>
      </View>
    </Dialog>
  );
}
