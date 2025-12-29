import { faChevronLeft, faEdit, faExclamationTriangle, faUser, } from '@awesome.me/kit-34e2017de2/icons/duotone/solid';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { Animated, Pressable, RefreshControl, View } from 'react-native';
import { useAPIGame } from '../../api/games/useAPIGame';
import { Content } from '../../components';
import { Button } from '../../components/Button';
import ListRow from '../../components/ListRow';
import { LoadingScreen } from '../../components/LoadingScreen';
import { useColours } from '../../hooks/useColours';
import { useGame, useGameActions } from '../../states/useGameStore';
import ScrollView = Animated.ScrollView;

export default function GamePage() {
  const colours = useColours();
  const { id } = useLocalSearchParams();
  const game = useGame();
  const { setGame } = useGameActions();
  const { refetch, data, isLoading } = useAPIGame(id as string);

  useEffect(() => {
    if (data) {
      setGame(data);
    }
  }, [data, setGame]);

  useEffect(() => {
    if (!id || game?.id === id) return;

    void refetch();
  }, [id, game, refetch]);

  if (game === null) {
    return (
      <View className={'m-auto flex w-1/2 flex-1 items-center justify-center gap-4'}>
        <FontAwesomeIcon icon={faExclamationTriangle} size={26} color={colours.warning} />

        <Content size={'sm'} type={'title'} center>
          Game not found
        </Content>

        <Content size={'sm'} type={'subtitle'} center>
          We couldn&#39;t find this game. It may have been deleted.
        </Content>
      </View>
    );
  }

  if (!game) {
    return <LoadingScreen message={'Loading game...'} />;
  }

  return (
    <ScrollView
      contentContainerClassName={'flex gap-6 h-full pb-12'}
      keyboardShouldPersistTaps={'handled'}
      showsVerticalScrollIndicator={false}
      contentInsetAdjustmentBehavior={'automatic'}
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={refetch} colors={[colours.primary]} />
      }>
      <View className={'flex grow gap-12'}>
        <View className={'flex flex-row items-center gap-4'}>
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
                member.list
                  ? `${member.list?.army} (${member.list.actualPoints}pts)`
                  : 'No list selected'
              }
              placeHolderIcon={faUser}
            />
          ))}

          <Button content={'Add Member'} variant={'outline'} />
        </View>

        <View className={'flex gap-6'}>
          <Content size={'xs'} type={'title'}>
            Additional Notes & Rules
          </Content>
          <Content size={'md'} type={'body'}>
            {game.description ?? 'None'}
          </Content>
        </View>
      </View>

      <Button content={'Start Game'} />
    </ScrollView>
  );
}
