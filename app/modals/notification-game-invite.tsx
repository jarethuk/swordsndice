import { useQueryClient } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useMemo } from 'react';
import { View } from 'react-native';
import { useAPIAcceptGameInvite } from '../../api/games/useAPIAcceptGameInvite';
import { useAPIDeclineGame } from '../../api/games/useAPIDeclineGame';
import { useAPIGameInvites } from '../../api/games/useAPIGameInvites';
import { Button } from '../../components/Button';
import { Dialog } from '../../components/Dialog';
import { LoadingScreen } from '../../components/LoadingScreen';

export default function NotificationGameInvite() {
	const { id } = useLocalSearchParams();
	const { data, isLoading } = useAPIGameInvites();

	const invite = useMemo(() => {
		return data?.find((x) => x.id === id);
	}, [data, id]);

	const client = useQueryClient();

	const { mutateAsync: apiAccept } = useAPIAcceptGameInvite();
	const { mutateAsync: apIDecline } = useAPIDeclineGame();

	const accept = useCallback(async () => {
		if (!invite) return;

		await apiAccept(invite.id);

		await client.invalidateQueries({
			queryKey: ['games'],
		});

		await client.invalidateQueries({
			queryKey: ['game-invites'],
		});

		router.push({ pathname: '/(tabs)/game', params: { id: invite.id } });
	}, [apiAccept, client, invite]);

	const decline = useCallback(async () => {
		if (!invite) return;

		await apIDecline(invite.id);

		await client.invalidateQueries({
			queryKey: ['game-invites'],
		});

		router.dismiss();
	}, [apIDecline, client, invite]);

	if (isLoading) return <LoadingScreen message={'Loading invite...'} />;

	if (!invite) return null;

	return (
		<Dialog
			title={`Game invite from @${invite.invitedBy.username}`}
			subtitle={`You have received an invite to join a ${invite.game} game of ${invite.points}pts`}
		>
			<View className={'flex flex-col items-center gap-4 md:flex-row'}>
				<View className={'grow'}>
					<Button content={'Decline'} onPress={decline} variant={'outline'} />
				</View>

				<View className={'grow'}>
					<Button content={'Accept'} onPress={accept} variant={'primary'} />
				</View>
			</View>
		</Dialog>
	);
}
