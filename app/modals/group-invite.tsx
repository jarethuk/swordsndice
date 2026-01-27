import { useQueryClient } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useMemo } from 'react';
import { View } from 'react-native';
import { useAPICancelGroupInvite } from '../../api/groups/useAPICancelGroupInvite';
import { useAPIGroup } from '../../api/groups/useAPIGroup';
import { Button } from '../../components/common/Button';
import { Dialog } from '../../components/common/Dialog';
import { LoadingScreen } from '../../components/common/LoadingScreen';

export default function GroupInvite() {
	const { id, groupId } = useLocalSearchParams();
	const { data, isLoading } = useAPIGroup(groupId as string);

	const invite = useMemo(() => {
		return data?.invites.find((x) => x.user.id === id);
	}, [data, id]);

	const client = useQueryClient();

	const { mutateAsync: apiCancelInvite } = useAPICancelGroupInvite(
		id as string,
	);

	const cancelInvite = useCallback(async () => {
		if (!invite) return;

		await apiCancelInvite({
			friendId: id as string,
		});

		await client.invalidateQueries({
			queryKey: ['group', groupId],
		});

		router.dismiss();
	}, [apiCancelInvite, client, groupId, id, invite]);

	if (isLoading) return <LoadingScreen message={'Loading group invite...'} />;

	if (!invite) return null;

	return (
		<Dialog
			title={'Manage Invite'}
			subtitle={`${invite.user.username} was invited by @@${invite.createdBy.username}`}
		>
			<View className={'flex flex-col items-center gap-4 md:flex-row'}>
				<View className={'grow'}>
					<Button
						content={'Cancel Invite'}
						onPress={cancelInvite}
						variant={'outline'}
					/>
				</View>
			</View>
		</Dialog>
	);
}
