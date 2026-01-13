import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import { View } from 'react-native';
import { useAPIDeleteGame } from '../../api/games/useAPIDeleteGame';
import { Button } from '../../components/Button';
import { Dialog } from '../../components/Dialog';
import { Input } from '../../components/Input';
import { useGame, useGameActions } from '../../states/useGameStore';

export default function EditGamePopup() {
  const game = useGame();
  const { updateGame } = useGameActions();
  const { mutateAsync: apiDeleteGame } = useAPIDeleteGame();

  const [points, setPoints] = useState(game?.points.toString() ?? '');
  const [description, setDescription] = useState(game?.description ?? '');

  const [isSaving, setIsSaving] = useState(false);

  const isValid = points && Number(points) > 0;

  const saveGame = useCallback(async () => {
    if (isSaving || !game) return;

    setIsSaving(true);

    await updateGame({
      description,
      points: Number(points),
    });

    setIsSaving(false);
    router.dismiss();
  }, [isSaving, game, updateGame, description, points]);

  const deleteGame = useCallback(async () => {
    if (!game) return;

    await apiDeleteGame(game.id);
    router.navigate('/(tabs)');
  }, [apiDeleteGame, game]);

  return (
    <Dialog title={'Edit Game'}>
      <View className={'flex grow flex-col gap-6'}>
        <Input
          placeholder={'Points'}
          value={points}
          onChange={setPoints}
          type={'numeric'}
          label={'Points'}
        />

        <Input
          value={description}
          onChange={setDescription}
          type={'text'}
          label={'Additional Notes & Rules'}
          multiline
        />

        <Button content={'Save'} disabled={!isValid} loading={isSaving} onPress={saveGame} />
      </View>

      <Button content={'Delete'} variant={'negative'} onPress={deleteGame} />
    </Dialog>
  );
}
