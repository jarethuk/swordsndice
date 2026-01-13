import { faUser, faUsers } from '@awesome.me/kit-34e2017de2/icons/duotone/solid';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Animated, View } from 'react-native';
import { useAPICancelGroupInvite } from '../../api/groups/useAPICancelGroupInvite';
import { useAPIGroup } from '../../api/groups/useAPIGroup';
import { useAPIRemoveMemberFromGroup } from '../../api/groups/useAPIRemoveMemberFromGroup';
import { useAPIUpdateGroupMember } from '../../api/groups/useAPIUpdateGroupMember';
import { Content } from '../../components';
import { Button } from '../../components/Button';
import ListRow from '../../components/ListRow';
import { LoadingScreen } from '../../components/LoadingScreen';
import { PageTitleWithImage } from '../../components/PageTitleWithImage';
import { Popup } from '../../components/Popup';
import { useColours } from '../../hooks/useColours';
import { useUser } from '../../states/useUserStore';
import type { UpdateGroupMemberRequest } from '../../types/api/requests/UpdateGroupMemberRequest';
import type { GroupResponseMember } from '../../types/api/responses/GroupResponse';

import { Page } from '../../components/Page';

export default function GroupPage() {
  const colours = useColours();
  const { id } = useLocalSearchParams();
  const user = useUser();
  const { data, refetch, isLoading } = useAPIGroup(id as string);
  const [selectedMember, setSelectedMember] = useState<GroupResponseMember | undefined>();
  const [selectedInvite, setSelectedInvite] = useState<GroupResponseMember | undefined>();

  const { mutateAsync: apiCancelInvite } = useAPICancelGroupInvite(id as string);
  const { mutateAsync: apiRemoveMember } = useAPIRemoveMemberFromGroup(id as string);
  const { mutateAsync: apiUpdateMember } = useAPIUpdateGroupMember(id as string);

  const isAdmin = useMemo(() => {
    return data?.members.find((x) => x.username === user?.username)?.isAdmin ?? false;
  }, [user, data]);

  useFocusEffect(
    useCallback(() => {
      void refetch();
    }, [refetch])
  );

  const cancelInvite = useCallback(async () => {
    if (!selectedInvite) return;

    await apiCancelInvite({
      friendId: selectedInvite.id,
    });

    setSelectedInvite(undefined);
    await refetch();
  }, [apiCancelInvite, refetch, selectedInvite]);

  const removeMember = useCallback(async () => {
    if (!selectedMember) return;

    await apiRemoveMember(selectedMember.id);

    setSelectedMember(undefined);
    await refetch();
  }, [apiRemoveMember, refetch, selectedMember]);

  const updateMember = useCallback(
    async (request: UpdateGroupMemberRequest) => {
      if (!selectedMember) return;

      await apiUpdateMember({
        ...request,
        id: selectedMember.id,
      });

      setSelectedMember(undefined);
      await refetch();
    },
    [apiUpdateMember, refetch, selectedMember]
  );

  if (!data) {
    return <LoadingScreen message={'Loading group...'} />;
  }

  if (!data) {
    return <LoadingScreen message={'Loading group...'} />;
  }

  return (
    <Page isLoading={isLoading} refetch={refetch}>
      <PageTitleWithImage
        title={data.name}
        image={data.image}
        description={data.description}
        placeholderIcon={faUsers}
        onEdit={
          isAdmin
            ? () =>
                router.navigate({
                  pathname: '/modals/edit-group',
                  params: {
                    id,
                  },
                })
            : undefined
        }
      />

      <Content type={'subtitle'} size={'md'}>
        Members ({data.members.length})
      </Content>

      {data.members.map((member) => (
        <ListRow
          key={member.username}
          title={`${member.username ?? ''} ${member.isAdmin ? '(Admin)' : ''}`}
          image={member.image}
          placeHolderIcon={faUser}
          onPress={() =>
            isAdmin
              ? setSelectedMember(member)
              : router.push({
                  pathname: '/(tabs)/friend',
                  params: { username: member.username },
                })
          }
        />
      ))}

      {data.invites.length > 0 && (
        <>
          <Content type={'subtitle'} size={'md'}>
            Invited ({data.invites.length})
          </Content>

          {data.invites.map((user) => (
            <ListRow
              key={user.username}
              title={user.username ?? ''}
              image={user.image}
              placeHolderIcon={faUser}
              onPress={() =>
                isAdmin
                  ? setSelectedInvite(user)
                  : router.push({
                      pathname: '/(tabs)/friend',
                      params: { username: user.username },
                    })
              }
            />
          ))}
        </>
      )}

      <Button
        content={'Invite Member'}
        onPress={() =>
          router.navigate({
            pathname: '/modals/invite-to-group',
            params: { id: id as string },
          })
        }
      />

      {selectedMember && (
        <Popup onDismiss={() => setSelectedMember(undefined)}>
          <View className={'flex gap-6'}>
            <Content size={'sm'} type={'title'} center>
              {selectedMember.username}
            </Content>

            <Button
              content={'View Profile'}
              onPress={() => {
                setSelectedMember(undefined);

                router.push({
                  pathname: '/(tabs)/friend',
                  params: { username: selectedMember.username },
                });
              }}
            />

            <Button content={'Remove Member'} variant={'negative'} onPress={removeMember} />

            {selectedMember.isAdmin ? (
              <Button
                content={'Remove Admin'}
                variant={'negative'}
                onPress={() =>
                  updateMember({
                    isAdmin: false,
                  })
                }
              />
            ) : (
              <Button
                content={'Make Admin'}
                variant={'negative'}
                onPress={() =>
                  updateMember({
                    isAdmin: true,
                  })
                }
              />
            )}
          </View>
        </Popup>
      )}

      {selectedInvite && (
        <Popup onDismiss={() => setSelectedMember(undefined)}>
          <View className={'flex gap-6'}>
            <Content size={'sm'} type={'title'} center>
              {selectedInvite.username}
            </Content>

            <Button
              content={'View Profile'}
              onPress={() => {
                setSelectedMember(undefined);

                router.push({
                  pathname: '/(tabs)/friend',
                  params: { username: selectedInvite.username },
                });
              }}
            />

            <Button content={'Cancel Invite'} variant={'negative'} onPress={cancelInvite} />
          </View>
        </Popup>
      )}
    </Page>
  );
}
