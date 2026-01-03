import { faMagnifyingGlass, faSword, } from '@awesome.me/kit-34e2017de2/icons/duotone/solid';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Animated } from 'react-native';
import { useAPIUpdateGameList } from '../../api/games/useAPIUpdateGameList';
import { useAPILists } from '../../api/list/useAPILists';
import { Content } from '../../components';
import { Input } from '../../components/Input';
import ListRow from '../../components/ListRow';
import { useColours } from '../../hooks/useColours';
import type { ListBody } from '../../types/api/ListBody';
import ScrollView = Animated.ScrollView;

export default function SetGameList() {
  const { id } = useLocalSearchParams();
  const colours = useColours();
  const [search, setSearch] = useState('');
  const { data } = useAPILists();

  const { mutateAsync: apiSetGameList } = useAPIUpdateGameList();

  const setList = useCallback(
    async (list: ListBody) => {
      await apiSetGameList({
        id: id as string,
        list,
      });

      router.back();
    },
    [apiSetGameList, id]
  );

  const lists = useMemo(() => {
    if (!data) return [];

    const lowered = search.toLowerCase();

    return search ? data.filter((x) => x.name.toLowerCase().includes(lowered)) : data;
  }, [search, data]);

  return (
    <ScrollView contentContainerClassName={'flex flex-col gap-6 p-6'}>
      <Content size={'sm'} type={'title'} center>
        Select List
      </Content>

      <Input
        placeholder={'Search'}
        value={search}
        onChange={setSearch}
        type={'search'}
        iconStart={<FontAwesomeIcon icon={faMagnifyingGlass} size={16} color={colours.primary} />}
      />

      {lists.map((list) => (
        <ListRow
          key={`${list.id}`}
          title={list.name}
          image={list.image}
          right={`${list.points}pts`}
          subtitle={list.army}
          onPress={() => setList(list)}
          placeHolderIcon={faSword}
        />
      ))}
    </ScrollView>
  );
}
