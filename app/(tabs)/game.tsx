import {faChevronLeft, faEdit, faExclamationTriangle, faUser,} from '@awesome.me/kit-34e2017de2/icons/duotone/solid';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {router, useLocalSearchParams} from 'expo-router';
import {useCallback, useEffect} from 'react';
import {Animated, Pressable, View} from 'react-native';
import {Content} from '../../components';
import {Button} from '../../components/Button';
import ListRow from '../../components/ListRow';
import {LoadingScreen} from '../../components/LoadingScreen';
import {getDBGame} from '../../db/DBGames';
import {useColours} from '../../hooks/useColours';

import {useGame, useGameActions} from '../../states/useGameStore';
import ScrollView = Animated.ScrollView;

export default function GamePage() {
	const colours = useColours();
	const { id } = useLocalSearchParams();
	const game = useGame();
	const { setGame } = useGameActions();

	const refreshGame = useCallback(async () => {
		getDBGame(id as string).then(setGame);
	}, [id]);

	useEffect(() => {
		if (!id || game?.id === id) return;

		void refreshGame();
	}, [id, game]);

	if (game === null) {
		return (
			<View
				className={'flex flex-1 items-center justify-center gap-4 w-1/2 m-auto'}
			>
				<FontAwesomeIcon
					icon={faExclamationTriangle}
					size={26}
					color={colours.warning}
				/>

				<Content size={'sm'} type={'title'} center>
					Game not found
				</Content>

				<Content size={'sm'} type={'subtitle'} center>
					We couldn't find this game. It may have been deleted.
				</Content>
			</View>
		);
	}

	if (!game) {
		return <LoadingScreen />;
	}

	return (
		<ScrollView
			contentContainerClassName={'flex gap-6 h-full pb-12'}
			keyboardShouldPersistTaps={'handled'}
			showsVerticalScrollIndicator={false}
			contentInsetAdjustmentBehavior={'automatic'}
		>
			<View className={'flex gap-12 grow'}>
				<View className={'flex flex-row gap-4 items-center'}>
					<Pressable onPress={() => router.back()}>
						<FontAwesomeIcon
							icon={faChevronLeft}
							size={20}
							color={colours.muted}
						/>
					</Pressable>

					<View className={'grow'}>
						<Content size={'sm'} type={'title'} center>
							{game.game} ({game.points}pts)
						</Content>
					</View>

					<Pressable onPress={() => router.navigate('/modals/game-edit')}>
						<FontAwesomeIcon icon={faEdit} size={20} color={colours.muted} />
					</Pressable>
				</View>

				<View className={'flex gap-6'}>
					<Content size={'xs'} type={'title'}>
						Members
					</Content>

					{game.members.map((member) => (
						<ListRow
							key={member.username}
							title={member.username}
							subtitle={
								member.list
									? `${member.list?.army} (${member.list.actualPoints}pts)`
									: 'No list selected'
							}
							placeHolderIcon={faUser}
						/>
					))}

					<Button content={'Add Member'} variant={'outline'} />
				</View>

				<View className={'flex gap-6'}>
					<Content size={'xs'} type={'title'}>
						Additional Notes & Rules
					</Content>
					<Content size={'md'} type={'body'}>
						{game.description ?? 'None'}
					</Content>
				</View>
			</View>

			<Button content={'Start Game'} />
		</ScrollView>
	);
}
