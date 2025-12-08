import {router} from 'expo-router';
import {useCallback, useState} from 'react';
import {Animated, View} from 'react-native';
import {Content} from '../../components';
import {Button} from '../../components/Button';
import {Input} from '../../components/Input';
import {deleteDBGame} from '../../db/DBGames';
import {useGame, useGameActions} from '../../states/useGameStore';
import ScrollView = Animated.ScrollView;

export default function EditGamePopup() {
	const game = useGame();
	const { updateGame } = useGameActions();

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
	}, [game, description, points, isSaving]);

	const deleteGame = useCallback(async () => {
		if (!game) return;

		await deleteDBGame(game.id);
		router.navigate('/(tabs)');
	}, [game]);

	return (
		<ScrollView
			contentContainerClassName={'flex flex-col gap-6 p-6 h-full'}
			keyboardShouldPersistTaps={'handled'}
			showsVerticalScrollIndicator={false}
			contentInsetAdjustmentBehavior={'automatic'}
		>
			<Content size={'sm'} type={'title'} center>
				Edit Game
			</Content>

			<View className={'flex flex-col gap-6 grow'}>
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
		</ScrollView>
	);
}
