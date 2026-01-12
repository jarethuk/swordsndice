import { faChevronLeft } from '@awesome.me/kit-34e2017de2/icons/duotone/solid';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';
import { useColours } from '../../hooks/useColours';
import { useUser } from '../../states/useUserStore';
import type { GameResponse } from '../../types/api/responses/GameResponse';
import { Content } from '../Content';
import { DropDown, type DropDownOption } from '../DropDown';
import { LoadingScreen } from '../LoadingScreen';
import { TabInput } from '../TabInput';
import { GamePlayHeroes } from './GamePlayHeroes';
import { GamePlayPoints } from './GamePlayPoints';

interface Props {
  id: string;
  game: GameResponse;
  refresh: () => void;
}

const Tabs = {
  MyList: 'my-list',
  OtherLists: 'other-lists',
};

export function GamePlay({ game, id }: Props) {
  const colours = useColours();
  const user = useUser();
  const [tab, setTab] = useState<string>('my-list');
  const [otherListMemberId, setOtherListMemberId] = useState<string | undefined>(undefined);

  const otherMembersOptions: DropDownOption[] = useMemo(() => {
    return game.members
      .filter((member) => member.user?.id !== user?.id)
      .map((member) => ({
        title: member.user?.username ?? '',
        value: member.user?.id ?? '',
      }));
  }, [game.members, user?.id]);

  useEffect(() => {
    if (!otherListMemberId && otherMembersOptions.length > 0) {
      setOtherListMemberId(otherMembersOptions[0].value);
    }
  }, [otherListMemberId, otherMembersOptions]);

  if (!user) {
    return <LoadingScreen message={'Loading game...'} />;
  }

  return (
    <View className={'flex gap-12'}>
      <View className={'flex gap-2'}>
        <View className={'flex flex-row items-center gap-4'}>
          <Pressable onPress={() => router.back()}>
            <FontAwesomeIcon icon={faChevronLeft} size={20} color={colours.muted} />
          </Pressable>

          <View className={'grow'}>
            <Content size={'sm'} type={'title'} center>
              {game.game} ({game.points}pts)
            </Content>
          </View>

          <View className={'w-4'} />
        </View>

        <Content size={'md'} type={'subtitle'} center muted>
          {game.members
            .map((member) => member.list?.army)
            .filter((x) => !!x)
            .join(' vs ')}
        </Content>
      </View>

      <View className={'flex gap-6'}>
        <Content size={'xs'} type={'title'}>
          Victory Points
        </Content>

        {game.members
          .sort((a, b) => (a.user?.username ?? '').localeCompare(b.user?.username ?? ''))
          .map((member) => (
            <GamePlayPoints key={member.user?.id} member={member} user={user} gameId={id} />
          ))}
      </View>

      <View className={'flex gap-6'}>
        {otherMembersOptions.length > 0 && (
          <TabInput
            selected={tab}
            tabs={[
              {
                title: 'My List',
                value: Tabs.MyList,
              },
              {
                title: 'Other Lists',
                value: Tabs.OtherLists,
              },
            ]}
            onChange={setTab}
          />
        )}

        {tab === Tabs.MyList && <GamePlayHeroes game={game} memberId={user.id} canUpdate={true} />}

        {tab === Tabs.OtherLists && (
          <View className={'flex gap-4'}>
            <View className={'ml-auto'}>
              <DropDown
                selected={otherListMemberId}
                options={otherMembersOptions}
                onChange={(value) => setOtherListMemberId(value)}
              />
            </View>

            {otherListMemberId && (
              <GamePlayHeroes game={game} memberId={otherListMemberId} canUpdate={false} />
            )}
          </View>
        )}
      </View>
    </View>
  );
}
