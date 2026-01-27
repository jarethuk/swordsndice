import { useQueryClient } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useMemo } from 'react';
import { View } from 'react-native';
import { useAPIDeclineGroupInvite } from '../../api/groups/useAPIDeclineGroupInvite';
import { useAPIGroupInvites } from '../../api/groups/useAPIGroupInvites';
import { useAPIJoinGroup } from '../../api/groups/useAPIJoinGroup';
import { Button } from '../../components/common/Button';
import { Dialog } from '../../components/common/Dialog';
import { LoadingScreen } from '../../components/common/LoadingScreen';

export default function NotificationGameInvite() {
  const { id } = useLocalSearchParams();
  const { data, isLoading } = useAPIGroupInvites();

  const group = useMemo(() => {
    return data?.find((x) => x.id === id);
  }, [data, id]);

  const client = useQueryClient();

  const { mutateAsync: apiAccept } = useAPIJoinGroup(id as string);
  const { mutateAsync: apIDecline } = useAPIDeclineGroupInvite(id as string);

  const accept = useCallback(async () => {
    if (!group) return;

    await apiAccept();

    await client.invalidateQueries({
      queryKey: ['groups'],
    });

    await client.invalidateQueries({
      queryKey: ['group-invites'],
    });

    router.push({ pathname: '/(tabs)/group', params: { id } });
  }, [apiAccept, client, id, group]);

  const decline = useCallback(async () => {
    if (!group) return;

    await apIDecline();

    await client.invalidateQueries({
      queryKey: ['group-invites'],
    });

    router.dismiss();
  }, [apIDecline, client, group]);

  if (isLoading) return <LoadingScreen message={'Loading group...'} />;

  if (!group) return null;

  return (
    <Dialog
      title={`Group invite from @${group.createdBy.username}`}
      subtitle={`You have received an invite to join the ${group.name} group`}>
      <View className={'flex flex-col items-center gap-4 md:flex-row'}>
        <View className={'grow'}>
          <Button content={'Decline'} onPress={decline} variant={'outline'} />
        </View>

        <View className={'grow'}>
          <Button content={'Accept'} onPress={accept} variant={'primary'} />
        </View>
      </View>
    </Dialog>
  );
}
