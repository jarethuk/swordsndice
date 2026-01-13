import {
  faChevronLeft,
  faEdit,
  faTimes,
  faUser,
  faWarning,
} from '@awesome.me/kit-34e2017de2/icons/duotone/solid';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { router } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';
import { useAPICancelGameInvite } from '../../api/games/useAPICancelGameInvite';
import { useAPIUpdateGame } from '../../api/games/useAPIUpdateGame';
import { useColours } from '../../hooks/useColours';
import { useUser } from '../../states/useUserStore';
import type { GameResponse } from '../../types/api/responses/GameResponse';
import type { PublicUser } from '../../types/api/responses/PublicUser';
import { Button } from '../Button';
import { Content } from '../Content';
import ListRow from '../ListRow';
import { Popup } from '../Popup';

interface Props {
  id: string;
  game: GameResponse;
  refresh: () => void;
}

export function GamePrep({ game, id, refresh }: Props) {
  const colours = useColours();
  const user = useUser();

  const [selectedInvite, setSelectedInvite] = useState<PublicUser | undefined>();
  const { mutateAsync: apiCancelInvite } = useAPICancelGameInvite(id as string);
  const { mutateAsync: apiUpdateGame } = useAPIUpdateGame(id as string);

  const addMember = useCallback(() => {
    router.navigate({
      pathname: '/modals/invite-to-game',
      params: {
        id: id,
      },
    });
  }, [id]);

  const setList = useCallback(() => {
    router.navigate({
      pathname: '/modals/set-game-list',
      params: {
        id: id,
      },
    });
  }, [id]);

  const cancelInvite = useCallback(async () => {
    if (!selectedInvite) return;

    setSelectedInvite(undefined);

    await apiCancelInvite({
      friendId: selectedInvite.id,
    });
    void refresh();
  }, [apiCancelInvite, refresh, selectedInvite]);

  const isWaitingOnLists = useMemo(() => {
    return !game.members.every((x) => x.list);
  }, [game]);

  const isWaitingOnInvites = useMemo(() => {
    return game.invites?.length !== 0;
  }, [game]);

  const canStartGame = useMemo(() => {
    return !isWaitingOnLists && !isWaitingOnInvites;
  }, [isWaitingOnInvites, isWaitingOnLists]);

  const anyListAboveGamePoints = useMemo(() => {
    return game.members.some((member) => member.list && member.list.actualPoints > game.points);
  }, [game]);

  const startGame = useCallback(async () => {
    await apiUpdateGame({
      isStarted: true,
    });

    refresh();
  }, [apiUpdateGame, refresh]);

  return (
    <>
      <View className={'flex grow gap-12'}>
        <View className={'flex flex-row items-center gap-6'}>
          <Pressable onPress={() => router.back()}>
            <FontAwesomeIcon icon={faChevronLeft} size={20} color={colours.muted} />
          </Pressable>

          <View className={'grow'}>
            <Content size={'sm'} type={'title'} center>
              {game.game} ({game.points}pts)
            </Content>
          </View>

          <Pressable onPress={() => router.navigate('/modals/game-edit')}>
            <FontAwesomeIcon icon={faEdit} size={20} color={colours.muted} />
          </Pressable>
        </View>

        <View className={'flex gap-6'}>
          <Content size={'xs'} type={'title'}>
            Members
          </Content>

          {game.members?.map((member) => (
            <ListRow
              key={member.user?.username}
              title={member.user?.username ?? ''}
              subtitle={
                <View className={'flex flex-row gap-1'}>
                  <Content type={'subtitle'} size={'md'} muted>
                    {member.list ? `${member.list?.army}` : 'No list selected'}
                  </Content>

                  {member.list?.actualPoints && (
                    <Content
                      type={'subtitle'}
                      size={'md'}
                      muted
                      variant={member.list.actualPoints > game.points ? 'negative' : undefined}>
                      ({member.list.actualPoints}pts)
                    </Content>
                  )}
                </View>
              }
              placeHolderIcon={faUser}
              onPress={() => (member.user?.username === user?.username ? setList() : undefined)}
            />
          ))}

          {game.invites?.map((member) => (
            <ListRow
              key={member.username}
              title={member.username ?? ''}
              subtitle={'Invited'}
              placeHolderIcon={faUser}
              onPress={() => setSelectedInvite(member)}
              image={member.image}
            />
          ))}

          <Button content={'Add Member'} variant={'outline'} onPress={addMember} />
        </View>

        <View className={'flex gap-6'}>
          <Content size={'xs'} type={'title'}>
            Additional Notes & Rules
          </Content>
          <Content size={'md'} type={'body'}>
            {game.description ?? 'None'}
          </Content>
        </View>

        <View className={'flex gap-4'}>
          <Button content={'Start Game'} disabled={!canStartGame} onPress={startGame} />

          {(isWaitingOnLists || isWaitingOnInvites || anyListAboveGamePoints) && (
            <View
              className={
                'border-border-light dark:border-border-dark flex gap-4 rounded-2xl border-2 p-4'
              }>
              {isWaitingOnLists && (
                <View className={'flex flex-row items-center gap-2'}>
                  <FontAwesomeIcon icon={faTimes} color={colours.negative} size={16} />

                  <Content size={'sm'} type={'body'}>
                    Waiting on list selection
                  </Content>
                </View>
              )}

              {isWaitingOnInvites && (
                <View className={'flex flex-row items-center gap-2'}>
                  <FontAwesomeIcon icon={faTimes} color={colours.negative} size={16} />
                  <Content size={'sm'} type={'body'}>
                    Waiting on invites
                  </Content>
                </View>
              )}

              {anyListAboveGamePoints && (
                <View className={'flex flex-row items-center gap-2'}>
                  <FontAwesomeIcon icon={faWarning} color={colours.warning} size={16} />
                  <Content size={'sm'} type={'body'}>
                    One or more lists exceed the game points limit
                  </Content>
                </View>
              )}
            </View>
          )}
        </View>
      </View>

      {selectedInvite && (
        <Popup onDismiss={() => setSelectedInvite(undefined)}>
          <View className={'flex flex-col gap-4'}>
            <Content size={'sm'} type={'title'} center>
              Manage Invite
            </Content>

            <Button content={'Cancel Invite'} onPress={cancelInvite} />
          </View>
        </Popup>
      )}
    </>
  );
}
