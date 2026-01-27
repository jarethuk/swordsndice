import { faSword } from '@awesome.me/kit-6b5fd61d92/icons/duotone/solid';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback } from 'react';
import { Dialog } from '../../components/common/Dialog';
import ListRow from '../../components/common/ListRow';
import { useNewGameActions } from '../../states/useNewGameStore';
import { useNewListActions } from '../../states/useNewListStore';
import { type Games, GamesList, SelectGameDialogMode } from '../../types';

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
		[mode, setNewGameGame, setNewListGame],
	);

	return (
		<Dialog title={'Select Game'}>
			{GamesList.map(({ title, value }) => (
				<ListRow
					key={value}
					title={title}
					onPress={() => onSelect(value)}
					placeHolderIcon={faSword}
				/>
			))}
		</Dialog>
	);
}
