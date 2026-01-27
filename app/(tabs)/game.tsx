import { faExclamationTriangle } from '@awesome.me/kit-6b5fd61d92/icons/duotone/solid';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect } from 'react';
import { View } from 'react-native';
import { useAPIGame } from '../../api/games/useAPIGame';
import { Content } from '../../components';
import { FAIcon } from '../../components/FAIcon';
import { GamePlay } from '../../components/game/GamePlay';
import { GamePrep } from '../../components/game/GamePrep';
import { LoadingScreen } from '../../components/LoadingScreen';
import { Page } from '../../components/Page';
import { useGame, useGameActions } from '../../states/useGameStore';

export default function GamePage() {
	const { id } = useLocalSearchParams();
	const game = useGame();
	const { setGame } = useGameActions();
	const { refetch, data, isLoading } = useAPIGame(id as string);

	useEffect(() => {
		if (data?.isStarted && !data.isComplete) {
			const interval = setInterval(refetch, 30000);
			return () => clearInterval(interval);
		}
	}, [data, refetch]);

	useEffect(() => {
		if (data) {
			setGame(data);
		}
	}, [data, setGame]);

	useFocusEffect(
		useCallback(() => {
			void refetch();
		}, [refetch]),
	);

	if (game === null) {
		return (
			<View
				className={'m-auto flex w-1/2 flex-1 items-center justify-center gap-4'}
			>
				<FAIcon icon={faExclamationTriangle} size={26} colour="warning" />

				<Content size={'sm'} type={'title'} center>
					Game not found
				</Content>

				<Content size={'sm'} type={'subtitle'} center>
					We couldn&#39;t find this game. It may have been deleted.
				</Content>
			</View>
		);
	}

	if (!game) {
		return <LoadingScreen message={'Loading game...'} />;
	}

	return (
		<Page isLoading={isLoading} refetch={refetch}>
			{!game.isStarted && (
				<GamePrep game={game} id={id as string} refresh={refetch} />
			)}

			{game.isStarted && (
				<GamePlay game={game} id={id as string} refresh={refetch} />
			)}
		</Page>
	);
}
