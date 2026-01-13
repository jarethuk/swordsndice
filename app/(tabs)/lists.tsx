import {
  faFaceThinking,
  faMagnifyingGlass,
  faPlus,
  faSword,
} from '@awesome.me/kit-34e2017de2/icons/duotone/solid';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';
import { useAPILists } from '../../api/list/useAPILists';
import { Content } from '../../components';
import { Container } from '../../components/Container';
import GamesDropdown from '../../components/GamesDropdown';
import { Input } from '../../components/Input';
import ListRow from '../../components/ListRow';
import { LoadingScreen } from '../../components/LoadingScreen';
import { Page } from '../../components/Page';
import { useColours } from '../../hooks/useColours';

export default function Lists() {
  const [game, setGame] = useState<string>('');
  const [search, setSearch] = useState('');
  const colours = useColours();
  const { data, isLoading, refetch } = useAPILists();

  const lists = useMemo(() => {
    if (!data) return [];

    let lists = game ? data.filter((list) => list.game === game) : data;

    if (search) {
      lists = lists.filter((list) => list.name.toLowerCase().includes(search.toLowerCase()));
    }

    return lists;
  }, [data, search, game]);

  if (!lists) {
    return <LoadingScreen message={'Loading lists...'} />;
  }

  return (
    <Container>
      <Input
        placeholder={'Find list'}
        value={search}
        onChange={setSearch}
        type={'search'}
        iconStart={<FontAwesomeIcon icon={faMagnifyingGlass} size={16} color={colours.primary} />}
      />

      <Page isLoading={isLoading} refetch={refetch}>
        <View className={'flex w-full flex-row'}>
          <GamesDropdown selected={game} onChange={setGame} />

          <Pressable
            className={'ml-auto flex flex-row items-center gap-3'}
            onPress={() => {
              router.navigate('/(tabs)/create-list');
            }}>
            <FontAwesomeIcon icon={faPlus} size={16} color={colours.primary} />
            <Content size={'xs'} type={'title'}>
              Create List
            </Content>
          </Pressable>
        </View>

        {lists.length === 0 ? (
          <View className={'flex h-96 items-center justify-center gap-6'}>
            <FontAwesomeIcon icon={faFaceThinking} color={colours.primary} size={32} />
            <Content size={'lg'} type={'subtitle'}>
              {search ? 'No lists found' : 'Create your first list to get started'}
            </Content>
          </View>
        ) : (
          <View className={'flex gap-6'}>
            {lists.map((list) => (
              <ListRow
                key={`${list.id}`}
                title={list.name}
                image={list.image}
                right={`${list.points}pts`}
                subtitle={list.army}
                onPress={() =>
                  router.push({
                    pathname: `/(tabs)/list`,
                    params: {
                      id: list.id,
                    },
                  })
                }
                placeHolderIcon={faSword}
              />
            ))}
          </View>
        )}
      </Page>
    </Container>
  );
}
