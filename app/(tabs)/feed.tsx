import { faChevronRight, faSwords } from '@awesome.me/kit-34e2017de2/icons/duotone/solid';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import dayjs from 'dayjs';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';
import { useAPIGames } from '../../api/games/useAPIGames';
import { Content } from '../../components';
import { Container } from '../../components/Container';
import { ListImage } from '../../components/ListImage';
import { LoadingScreen } from '../../components/LoadingScreen';
import { Page } from '../../components/Page';
import { PageTitle } from '../../components/PageTitle';
import { TabInput } from '../../components/TabInput';
import { useColours } from '../../hooks/useColours';
import type { GameListResponse } from '../../types/api/responses/GameListResponse';

enum Tabs {
  Feed = 'feed',
  MyGames = 'my-games',
}

interface DateGroup {
  date: string;
  items: GameListResponse[];
}

interface MyGamesTabProps {
  data: GameListResponse[];
  isLoading: boolean;
  refetch: () => void;
}

const getGameTitle = (game: GameListResponse): string => {
  if (game.members && game.members.length > 0) {
    if (game.members.every((x) => x.army)) {
      return game.members.map((x) => x.army).join(' vs ');
    }

    return game.members.map((x) => x.username).join(' vs ');
  }

  return `${game.game} (${game.points} points)`;
};

const MyGamesTab = ({ data, isLoading, refetch }: MyGamesTabProps) => {
  const colours = useColours();

  const groups: DateGroup[] = useMemo(() => {
    if (!data?.length) return [];

    return data.reduce((acc: DateGroup[], game: GameListResponse) => {
      const date = dayjs(game.createdAt).format('DD MMM YYYY');
      const group = acc.find((x) => x.date === date);

      if (group) {
        group.items.push(game);
      } else {
        acc.push({ date, items: [game] });
      }

      return acc;
    }, []);
  }, [data]);

  if (!data) {
    return <LoadingScreen message={'Loading games...'} />;
  }

  return (
    <Page isLoading={isLoading} refetch={refetch}>
      {groups.map(({ date, items }) => (
        <View key={date} className={'flex flex-col gap-6'}>
          <Content size={'md'} type={'subtitle'}>
            {date}
          </Content>

          {items.map((item) => (
            <Pressable
              key={item.id}
              className={
                'border-border-light dark:border-border-dark flex w-full flex-row items-center gap-4 rounded-2xl border-2 p-4'
              }
              onPress={() =>
                router.push({
                  pathname: '/(tabs)/game',
                  params: {
                    id: item.id,
                  },
                })
              }>
              <ListImage image={item.image} placeHolderIcon={faSwords} />

              <View className={'flex grow'}>
                <Content type={'title'} size={'xs'}>
                  {getGameTitle(item)}
                </Content>

                <Content type={'subtitle'} size={'md'} muted>
                  {item.game} ({item.points}pts)
                </Content>
              </View>

              <FontAwesomeIcon icon={faChevronRight} size={16} color={colours.text} />
            </Pressable>
          ))}
        </View>
      ))}

      {groups.length === 0 && (
        <View className={'flex h-full items-center justify-center'}>
          <Content size={'md'} type={'body'} center>
            You haven&apos;t created any games yet.
          </Content>
        </View>
      )}
    </Page>
  );
};

export default function Feed() {
  const [tab, setTab] = useState<string>(Tabs.MyGames);
  const { data, refetch, isLoading } = useAPIGames();

  if (!data) return <LoadingScreen message={'Loading activity...'} />;

  return (
    <Container>
      <PageTitle title={'Recent Activity'} refetch={refetch} />

      <TabInput
        selected={tab}
        tabs={[
          {
            title: 'My Games',
            value: Tabs.MyGames,
          },
          {
            title: 'Feed',
            value: Tabs.Feed,
          },
        ]}
        onChange={setTab}
      />

      {tab === Tabs.MyGames && <MyGamesTab data={data} isLoading={isLoading} refetch={refetch} />}
    </Container>
  );
}
