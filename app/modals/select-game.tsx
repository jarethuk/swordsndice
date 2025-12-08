import {router, useLocalSearchParams} from 'expo-router';
import {useCallback} from 'react';
import {View} from 'react-native';
import {Content} from '../../components';
import {NextWindowButton} from '../../components/NextWindowButton';
import {useNewGameActions} from '../../states/useNewGameStore';
import {useNewListActions} from '../../states/useNewListStore';
import {type Games, GamesList, SelectGameDialogMode} from '../../types';

export default function SelectGame() {
	const { mode } = useLocalSearchParams();
	const { setGame: setNewListGame } = useNewListActions();
	const { setGame: setNewGameGame } = useNewGameActions();

	const onSelect = useCallback(
		(game: Games) => {
			switch (mode) {
				case SelectGameDialogMode.CreateGame:
					setNewGameGame(game);
					break;
				case SelectGameDialogMode.CreateList:
					setNewListGame(game);
					break;
			}

			router.dismiss();
		},
		[mode],
	);

	return (
		<View className={'flex flex-col gap-6 p-6'}>
			<Content size={'sm'} type={'title'} center>
				Select Game
			</Content>

			{GamesList.map(({ title, value }) => (
				<NextWindowButton
					key={value}
					label={title}
					onPress={() => onSelect(value)}
				/>
			))}
		</View>
	);
}
