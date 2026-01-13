import { faMagnifyingGlass, faUser } from '@awesome.me/kit-34e2017de2/icons/duotone/solid';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { View } from 'react-native';
import { useAPIFriends } from '../../api/friends/useAPIFriends';
import { useAPIGroup } from '../../api/groups/useAPIGroup';
import { useAPIInviteToGroup } from '../../api/groups/useAPIInviteToGroup';
import { Content } from '../../components';
import { Dialog } from '../../components/Dialog';
import { Input } from '../../components/Input';
import ListRow from '../../components/ListRow';
import { useColours } from '../../hooks/useColours';

export default function InviteToGroup() {
  const { id } = useLocalSearchParams();
  const colours = useColours();
  const [search, setSearch] = useState('');
  const { data } = useAPIFriends();
  const { data: group } = useAPIGroup(id as string);

  const { mutateAsync: invite } = useAPIInviteToGroup(id as string);

  const friends = useMemo(() => {
    if (!data || !group) return [];

    const lowered = search.toLowerCase();

    const alreadyAdded = [
      ...(group.invites?.map((x) => x.username) ?? []),
      group.members.map((x) => x.username),
    ];

    const filteredFriends = data.filter((x) => !alreadyAdded.includes(x.username));

    return search
      ? filteredFriends.filter((x) => x.username.toLowerCase().includes(lowered))
      : filteredFriends;
  }, [data, group, search]);

  const inviteMember = useCallback(
    async (id: string) => {
      await invite({
        friendId: id,
      });

      router.back();
    },
    [invite]
  );

  return (
    <Dialog title={'Select Friend'}>
      <Input
        placeholder={'Search'}
        value={search}
        onChange={setSearch}
        type={'search'}
        iconStart={<FontAwesomeIcon icon={faMagnifyingGlass} size={16} color={colours.primary} />}
      />

      {friends.map(({ username, image, id }) => (
        <ListRow
          key={username}
          title={`@${username}`}
          placeHolderIcon={faUser}
          image={image}
          onPress={() => inviteMember(id)}
        />
      ))}

      {friends.length === 0 && (
        <View className={'flex h-full items-center justify-center'}>
          <Content size={'md'} type={'body'} center>
            All friends are either invited or members
          </Content>
        </View>
      )}
    </Dialog>
  );
}
