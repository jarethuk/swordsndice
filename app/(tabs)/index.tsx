import { faSword } from '@awesome.me/kit-6b5fd61d92/icons/duotone/solid';
import { useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import { useAPIAddGame } from '../../api/games/useAPIAddGame';
import { useAPIGames } from '../../api/games/useAPIGames';
import { useAPIUpdateGameList } from '../../api/games/useAPIUpdateGameList';
import { Content } from '../../components';
import { Button } from '../../components/Button';
import Divider from '../../components/Divider';
import GameRow from '../../components/GameRow';
import { Input } from '../../components/Input';
import { ListImage } from '../../components/ListImage';
import { NextWindowButton } from '../../components/NextWindowButton';
import { Page } from '../../components/Page';
import { TabInput } from '../../components/TabInput';
import { getRandomId } from '../../helpers/RandomHelper';
import {
	useNewGameActions,
	useNewGameGame,
	useNewGameList,
	useNewGamePoints,
} from '../../states/useNewGameStore';
import { useUser } from '../../states/useUserStore';
import { SelectGameDialogMode } from '../../types';
import type { CreateGameRequest } from '../../types/api/requests/CreateGameRequest';

const StartGameTab = () => {
	const list = useNewGameList();
	const game = useNewGameGame();
	const points = useNewGamePoints();
	const [isCreating, setIsCreating] = useState(false);
	const user = useUser();
	const { setPoints, reset } = useNewGameActions();
	const client = useQueryClient();

	const { mutateAsync: apiCreateGame } = useAPIAddGame();
	const { mutateAsync: apiSetGameList } = useAPIUpdateGameList();

	const isValid = useMemo(() => {
		return game && points && Number(points) > 0;
	}, [game, points]);

	const createGame = useCallback(async () => {
		if (isCreating || !user) return;

		setIsCreating(true);

		let newGame: CreateGameRequest;

		const baseGame = {
			inviteCode: getRandomId(),
		};

		if (list) {
			newGame = {
				...baseGame,
				game: list.game,
				points: list.points,
			};
		} else {
			if (!game || !points) return;

			newGame = {
				...baseGame,
				game,
				points: Number(points),
			};
		}

		const { id } = await apiCreateGame(newGame);

		if (list) {
			await apiSetGameList({
				id,
				list,
			});
		}

		reset();
		setIsCreating(false);

		await client.invalidateQueries({
			queryKey: ['games'],
		});

		router.push({
			pathname: '/(tabs)/game',
			params: {
				id,
			},
		});
	}, [
		isCreating,
		user,
		list,
		apiCreateGame,
		reset,
		client,
		game,
		points,
		apiSetGameList,
	]);

	return (
		<View className={'flex flex-col gap-6'}>
			<Content size={'sm'} type={'title'} center>
				Create From List
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

export default function Index() {
	const { data, refetch } = useAPIGames('active');
	const [tab, setTab] = useState<string>('active');

	const showTabs = !!data?.length;

	useEffect(() => {
		if (!data?.length && tab === 'active') {
			setTab('new');
		}
	}, [data?.length, tab]);

	return (
		<Page
			title={'Play'}
			subtitle={
				'Select a list to automatically setup a game or manually create a new one.'
			}
			refetch={refetch}
		>
			{showTabs && (
				<TabInput
					selected={tab}
					tabs={[
						{
							title: 'In Progress',
							value: 'active',
						},
						{
							title: 'New Game',
							value: 'new',
						},
					]}
					onChange={setTab}
				/>
			)}

			{tab === 'active' &&
				data?.map((item) => <GameRow key={item.id} item={item} />)}

			{tab === 'new' && <StartGameTab />}
		</Page>
	);
}
