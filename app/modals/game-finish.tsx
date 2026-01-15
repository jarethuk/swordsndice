import { faUser } from '@awesome.me/kit-34e2017de2/icons/duotone/solid';
import { useQueryClient } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useMemo } from 'react';
import { View } from 'react-native';
import { useAPIGame } from '../../api/games/useAPIGame';
import { useAPIUpdateGame } from '../../api/games/useAPIUpdateGame';
import { Content } from '../../components';
import { Button } from '../../components/Button';
import { Dialog } from '../../components/Dialog';
import { GamePlayPoints } from '../../components/game/GamePlayPoints';
import ListRow from '../../components/ListRow';
import { LoadingScreen } from '../../components/LoadingScreen';
import { useUser } from '../../states/useUserStore';

export default function GameFinishModal() {
	const { id } = useLocalSearchParams();
	const { data, isLoading, refetch } = useAPIGame(id as string);
	const user = useUser();

	const client = useQueryClient();

	const { mutateAsync: apiUpdateGame } = useAPIUpdateGame(id as string);

	const finishGame = useCallback(async () => {
		if (!data) return;

		await apiUpdateGame({
			isComplete: true,
		});

		await client.invalidateQueries({
			queryKey: ['game', id],
		});

		await client.invalidateQueries({
			queryKey: ['games'],
		});

		router.dismiss();
	}, [apiUpdateGame, client, data, id]);

	const winners = useMemo(() => {
		if (!data?.members.length) return [];

		const maxPoints = Math.max(...data.members.map((m) => m.points ?? 0));

		return data.members.filter((member) => (member.points ?? 0) === maxPoints);
	}, [data?.members]);

	if (isLoading) return <LoadingScreen message={'Loading game...'} />;

	if (!data || !user) return null;

	return (
		<Dialog
			title={'Finish Game'}
			subtitle={'Check the results and finish the game'}
		>
			<View className={'flex gap-6'}>
				<Content size={'xs'} type={'title'}>
					Victory Points
				</Content>

				{data.members
					.sort((a, b) =>
						(a.user?.username ?? '').localeCompare(b.user?.username ?? ''),
					)
					.map((member) => (
						<GamePlayPoints
							key={member.user?.id}
							member={member}
							user={user}
							gameId={id as string}
							refresh={refetch}
						/>
					))}
			</View>

			<View className={'flex gap-6'}>
				<Content size={'xs'} type={'title'}>
					{winners.length > 1 ? 'Winners' : 'Winner'}
				</Content>

				{winners.map((winner) => (
					<ListRow
						key={winner.user?.id}
						title={winner.user?.username ?? ''}
						subtitle={`${winner.points} victory points`}
						placeHolderIcon={faUser}
						image={winner.user?.image}
					/>
				))}
			</View>

			<Button
				content={'Finish Game'}
				onPress={finishGame}
				variant={'outline'}
			/>
		</Dialog>
	);
}
