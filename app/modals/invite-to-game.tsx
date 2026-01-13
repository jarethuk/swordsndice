import { faMagnifyingGlass, faUser } from '@awesome.me/kit-34e2017de2/icons/duotone/solid';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { useAPIFriends } from '../../api/friends/useAPIFriends';
import { useAPIGame } from '../../api/games/useAPIGame';
import { useAPIInviteToGame } from '../../api/games/useAPIInviteToGame';
import { Content } from '../../components';
import { Dialog } from '../../components/Dialog';
import { Input } from '../../components/Input';
import ListRow from '../../components/ListRow';
import { useColours } from '../../hooks/useColours';

export default function InviteToGame() {
  const { id } = useLocalSearchParams();
  const colours = useColours();
  const [search, setSearch] = useState('');
  const { data } = useAPIFriends();
  const { data: game } = useAPIGame(id as string);

  const { mutateAsync: invite } = useAPIInviteToGame(id as string);

  const friends = useMemo(() => {
    if (!data || !game) return [];

    const lowered = search.toLowerCase();

    const alreadyAdded = [
      ...(game.invites?.map((x) => x.username) ?? []),
      game.members.map((x) => x.user?.username),
    ];

    const filteredFriends = data.filter((x) => !alreadyAdded.includes(x.username));

    return search
      ? filteredFriends.filter((x) => x.username.toLowerCase().includes(lowered))
      : filteredFriends;
  }, [data, game, search]);

  const addMember = useCallback(
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
          title={username}
          placeHolderIcon={faUser}
          image={image}
          onPress={() => addMember(id)}
        />
      ))}

      {friends.length === 0 && (
        <Content size={'md'} type={'body'} center>
          All friends are either invited or members
        </Content>
      )}
    </Dialog>
  );
}
