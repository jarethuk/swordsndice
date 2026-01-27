import {
	faChevronLeft,
	faEdit,
	faTimes,
	faUser,
	faWarning,
} from '@awesome.me/kit-6b5fd61d92/icons/duotone/solid';
import { router } from 'expo-router';
import { useCallback, useMemo } from 'react';
import { Pressable, View } from 'react-native';
import { useAPIUpdateGame } from '../../api/games/useAPIUpdateGame';
import { useUser } from '../../states/useUserStore';
import type { GameResponse } from '../../types/api/responses/GameResponse';
import { Button } from '../Button';
import { Content } from '../Content';
import { FAIcon } from '../FAIcon';
import ListRow from '../ListRow';

interface Props {
	id: string;
	game: GameResponse;
	refresh: () => void;
}

export function GamePrep({ game, id, refresh }: Props) {
	const user = useUser();

	const { mutateAsync: apiUpdateGame } = useAPIUpdateGame(id as string);

	const addMember = useCallback(() => {
		router.navigate({
			pathname: '/modals/invite-to-game',
			params: {
				id: id,
			},
		});
	}, [id]);

	const setList = useCallback(() => {
		router.navigate({
			pathname: '/modals/set-game-list',
			params: {
				id: id,
			},
		});
	}, [id]);

	const isWaitingOnLists = useMemo(() => {
		return !game.members.every((x) => x.list);
	}, [game]);

	const isWaitingOnInvites = useMemo(() => {
		return game.invites?.length !== 0;
	}, [game]);

	const canStartGame = useMemo(() => {
		return !isWaitingOnLists && !isWaitingOnInvites;
	}, [isWaitingOnInvites, isWaitingOnLists]);

	const anyListAboveGamePoints = useMemo(() => {
		return game.members.some(
			(member) => member.list && member.list.actualPoints > game.points,
		);
	}, [game]);

	const startGame = useCallback(async () => {
		await apiUpdateGame({
			isStarted: true,
		});

		refresh();
	}, [apiUpdateGame, refresh]);

	return (
		<View className={'flex grow gap-12'}>
			<View className={'flex flex-row items-center gap-6'}>
				<Pressable onPress={() => router.back()}>
					<FAIcon icon={faChevronLeft} size={20} colour="muted" />
				</Pressable>

				<View className={'grow'}>
					<Content size={'sm'} type={'title'} center>
						{game.game} ({game.points}pts)
					</Content>
				</View>

				<Pressable onPress={() => router.navigate('/modals/game-edit')}>
					<FAIcon icon={faEdit} size={20} colour="muted" />
				</Pressable>
			</View>

			<View className={'flex gap-6'}>
				<Content size={'xs'} type={'title'}>
					Members
				</Content>

				{game.members?.map((member) => (
					<ListRow
						key={member.user?.username}
						title={`@${member.user?.username}`}
						subtitle={
							<View className={'flex flex-row gap-1'}>
								<Content type={'subtitle'} size={'md'} muted>
									{member.list ? `${member.list?.army}` : 'No list selected'}
								</Content>

								{member.list?.actualPoints && (
									<Content
										type={'subtitle'}
										size={'md'}
										muted
										variant={
											member.list.actualPoints > game.points
												? 'negative'
												: undefined
										}
									>
										({member.list.actualPoints}pts)
									</Content>
								)}
							</View>
						}
						placeHolderIcon={faUser}
						onPress={() =>
							member.user?.username === user?.username ? setList() : undefined
						}
					/>
				))}

				{game.invites?.map((member) => (
					<ListRow
						key={member.username}
						title={`@${member.username}`}
						subtitle={'Invited'}
						placeHolderIcon={faUser}
						onPress={() =>
							router.navigate({
								pathname: '/modals/game-invite',
								params: { id: member.id, gameId: game.id },
							})
						}
						image={member.image}
					/>
				))}

				<Button
					content={'Add Member'}
					variant={'outline'}
					onPress={addMember}
				/>
			</View>

			<View className={'flex gap-6'}>
				<Content size={'xs'} type={'title'}>
					Additional Notes & Rules
				</Content>
				<Content size={'md'} type={'body'}>
					{game.description ?? 'None'}
				</Content>
			</View>

			<View className={'flex gap-4'}>
				<Button
					content={'Start Game'}
					disabled={!canStartGame}
					onPress={startGame}
				/>

				{(isWaitingOnLists || isWaitingOnInvites || anyListAboveGamePoints) && (
					<View
						className={
							'border-border-light dark:border-border-dark flex gap-4 rounded-2xl border-2 p-4'
						}
					>
						{isWaitingOnLists && (
							<View className={'flex flex-row items-center gap-2'}>
								<FAIcon icon={faTimes} colour="negative" />

								<Content size={'sm'} type={'body'}>
									Waiting on list selection
								</Content>
							</View>
						)}

						{isWaitingOnInvites && (
							<View className={'flex flex-row items-center gap-2'}>
								<FAIcon icon={faTimes} colour="negative" />
								<Content size={'sm'} type={'body'}>
									Waiting on invites
								</Content>
							</View>
						)}

						{anyListAboveGamePoints && (
							<View className={'flex flex-row items-center gap-2'}>
								<FAIcon icon={faWarning} colour="warning" />
								<Content size={'sm'} type={'body'}>
									One or more lists exceed the game points limit
								</Content>
							</View>
						)}
					</View>
				)}
			</View>
		</View>
	);
}
