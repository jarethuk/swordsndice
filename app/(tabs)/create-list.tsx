import { useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { router } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Animated } from 'react-native';
import { useAPICreateList } from '../../api/list/useAPICreateList';
import { Content } from '../../components';
import { Button } from '../../components/Button';
import { ErrorMessage } from '../../components/ErrorMessage';
import { Input } from '../../components/Input';
import { NextWindowButton } from '../../components/NextWindowButton';
import {
  useNewListActions,
  useNewListArmy,
  useNewListGame,
  useNewListName,
  useNewListPoints,
} from '../../states/useNewListStore';
import { SelectGameDialogMode } from '../../types';
import type { ListBody } from '../../types/api/ListBody';
import ScrollView = Animated.ScrollView;

export default function CreateList() {
  const queryClient = useQueryClient();
  const name = useNewListName();
  const army = useNewListArmy();
  const game = useNewListGame();
  const points = useNewListPoints();
  const { setName, setPoints, reset } = useNewListActions();
  const [error, setError] = useState<AxiosError | undefined>();

  const { mutateAsync } = useAPICreateList();
  const [isCreating, setIsCreating] = useState(false);

  const isValid = useMemo(() => {
    const intPoints = parseInt(points ?? '', 10);

    return game && army && name && points && intPoints > 0;
  }, [game, army, name, points]);

  const createList = useCallback(async () => {
    if (!game || !army || !name || !points || isCreating) return;

    setIsCreating(true);

    const list: ListBody = {
      name,
      army,
      game,
      points: Number(points),
      actualPoints: 0,
      groups: [],
    };

    try {
      const { id } = await mutateAsync(list);

      setIsCreating(false);
      reset();

      await queryClient.invalidateQueries({
        queryKey: ['lists'],
      });

      router.push({
        pathname: '/(tabs)/list',
        params: { id },
      });
    } catch (e) {
      const error = e as AxiosError;
      setError(error);
      setIsCreating(false);
    }
  }, [game, army, name, points, isCreating, mutateAsync, reset, queryClient]);

  return (
    <ScrollView contentContainerClassName={'flex gap-6'} keyboardDismissMode={'interactive'}>
      <Content size={'sm'} type={'title'} center>
        Create List
      </Content>

      <Input placeholder={'Name'} value={name ?? ''} onChange={setName} type={'text'} />

      <NextWindowButton
        onPress={() =>
          router.navigate({
            pathname: '/modals/select-game',
            params: { mode: SelectGameDialogMode.CreateList },
          })
        }
        label={game ?? 'Select Game'}
      />

      <NextWindowButton
        onPress={() => router.navigate('/modals/select-army')}
        label={army ?? 'Select Army'}
        disabled={!game}
      />

      <Input placeholder={'Points'} value={points ?? ''} onChange={setPoints} type={'numeric'} />

      <ErrorMessage error={error} />

      <Button
        content={'Create List'}
        disabled={!isValid}
        loading={isCreating}
        onPress={createList}
      />
    </ScrollView>
  );
}
