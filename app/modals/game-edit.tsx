import { useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import { View } from 'react-native';
import { useAPIDeleteGame } from '../../api/games/useAPIDeleteGame';
import { Button } from '../../components/common/Button';
import { Dialog } from '../../components/common/Dialog';
import { Input } from '../../components/common/Input';
import { useGame, useGameActions } from '../../states/useGameStore';

export default function EditGamePopup() {
	const game = useGame();
	const { updateGame } = useGameActions();
	const { mutateAsync: apiDeleteGame } = useAPIDeleteGame();
	const client = useQueryClient();

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

		await client.invalidateQueries({
			queryKey: ['games'],
		});

		setIsSaving(false);
		router.dismiss();
	}, [isSaving, game, updateGame, description, points, client]);

	const deleteGame = useCallback(async () => {
		if (!game) return;

		await apiDeleteGame(game.id);

		await client.invalidateQueries({
			queryKey: ['games'],
		});

		router.navigate('/(tabs)');
	}, [apiDeleteGame, client, game]);

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

				<Button
					content={'Save'}
					disabled={!isValid}
					loading={isSaving}
					onPress={saveGame}
				/>
			</View>

			<Button content={'Delete'} variant={'negative'} onPress={deleteGame} />
		</Dialog>
	);
}
