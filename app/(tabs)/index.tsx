import {faSword} from '@awesome.me/kit-34e2017de2/icons/duotone/solid';
import {router} from 'expo-router';
import {useCallback, useMemo, useState} from 'react';
import {Animated, View} from 'react-native';
import {Content} from '../../components';
import {Button} from '../../components/Button';
import Divider from '../../components/Divider';
import {Input} from '../../components/Input';
import {ListImage} from '../../components/ListImage';
import {NextWindowButton} from '../../components/NextWindowButton';
import {TabInput} from '../../components/TabInput';
import {addDBGame} from '../../db/DBGames';
import {getRandomId} from '../../helpers/RandomHelper';
import {useNewGameActions, useNewGameGame, useNewGameList, useNewGamePoints,} from '../../states/useNewGameStore';
import {useUser} from '../../states/useUserStore';
import {SelectGameDialogMode} from '../../types';
import type {Game} from '../../types/Game';
import ScrollView = Animated.ScrollView;

enum Tabs {
	Create = 'Create',
	Join = 'Join',
}

const StartGameTab = () => {
	const list = useNewGameList();
	const game = useNewGameGame();
	const points = useNewGamePoints();
	const [isCreating, setIsCreating] = useState(false);
	const user = useUser();
	const { setPoints, reset } = useNewGameActions();

	const isValid = useMemo(() => {
		return game && points && Number(points) > 0;
	}, [game, points]);

	const createGame = useCallback(async () => {
		if (isCreating || !user) return;

		setIsCreating(true);

		let newGame: Game;

		const baseGame = {
			id: getRandomId(),
			inviteCode: getRandomId(),
			createdAt: new Date(),
			members: [
				{
					username: user?.username,
				},
			],
		};

		if (list) {
			newGame = {
				...baseGame,
				game: list.game,
				points: list.points,
			};

			newGame.members[0].list = list;
		} else {
			if (!game || !points) return;

			newGame = {
				...baseGame,
				game,
				points: Number(points),
			};
		}

		await addDBGame(newGame);
		reset();
		setIsCreating(false);

		router.navigate({
			pathname: '/(tabs)/game',
			params: {
				id: newGame.id,
			},
		});
	}, [list, game, points, isCreating, setIsCreating, user]);

	return (
		<View className={'flex flex-col gap-6'}>
			<Content size={'md'} type={'body'} center>
				Select a list to automatically setup a game or manually create a new
				one.
			</Content>

			<NextWindowButton
				onPress={() => router.navigate('/modals/select-list')}
				label={list?.name ?? 'Select List'}
				subtitle={list?.army}
				iconStart={
					list ? (
						<ListImage image={list.image} placeHolderIcon={faSword} />
					) : undefined
				}
			/>

			{list && (
				<Button
					content={'Create Game'}
					loading={isCreating}
					onPress={createGame}
				/>
			)}

			<Divider />

			<Content size={'sm'} type={'title'} center>
				Manual Setup
			</Content>

			<NextWindowButton
				onPress={() =>
					router.navigate({
						pathname: '/modals/select-game',
						params: { mode: SelectGameDialogMode.CreateGame },
					})
				}
				label={game ?? 'Select Game'}
			/>

			<Input
				placeholder={'Points'}
				value={points ?? ''}
				onChange={setPoints}
				type={'numeric'}
			/>

			<Button
				content={'Create Game'}
				disabled={!isValid}
				loading={isCreating}
				onPress={createGame}
			/>
		</View>
	);
};

const JoinGameTab = () => {
	const [inviteCode, setInviteCode] = useState('');

	return (
		<View className={'flex flex-col gap-6'}>
			<Content size={'md'} type={'body'} center>
				Enter the invite code to join an existing game.
			</Content>

			<Input
				placeholder={'Invite Code'}
				value={inviteCode ?? ''}
				onChange={setInviteCode}
				type={'text'}
			/>

			<Button content={'Join Game'} disabled={inviteCode?.length < 6} />
		</View>
	);
};

export default function Index() {
	const [tab, setTab] = useState<string>(Tabs.Create);

	return (
		<ScrollView
			contentContainerClassName={'flex flex-col gap-6'}
			keyboardShouldPersistTaps={'handled'}
			showsVerticalScrollIndicator={false}
			contentInsetAdjustmentBehavior={'automatic'}
		>
			<TabInput
				selected={tab}
				tabs={[
					{
						title: 'Create Game',
						value: Tabs.Create,
					},
					{
						title: 'Join Game',
						value: Tabs.Join,
					},
				]}
				onChange={setTab}
			/>

			{tab === Tabs.Create && <StartGameTab />}

			{tab === Tabs.Join && <JoinGameTab />}
		</ScrollView>
	);
}
