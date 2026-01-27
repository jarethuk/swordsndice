import { faUser } from '@awesome.me/kit-6b5fd61d92/icons/duotone/solid';
import { useQueryClient } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';
import { useCallback } from 'react';
import { useAPIAddFriend } from '../../api/friends/useAPIAddFriend';
import { useAPIRemoveFriend } from '../../api/friends/useAPIRemoveFriend';
import { useAPIGetUser } from '../../api/user/useAPIGetUser';
import { Button } from '../../components/common/Button';
import { LoadingScreen } from '../../components/common/LoadingScreen';
import { Page } from '../../components/common/Page';
import { PageTitleWithImage } from '../../components/common/PageTitleWithImage';

export default function FriendPage() {
	const { username } = useLocalSearchParams();
	const { data, refetch, isLoading } = useAPIGetUser(username as string);
	const client = useQueryClient();

	const { mutateAsync: addFriendAsync } = useAPIAddFriend();
	const { mutateAsync: removeFriendAsync } = useAPIRemoveFriend();

	const addFriend = useCallback(async () => {
		if (!data) return;

		await addFriendAsync({
			friendId: data.id,
		});

		await refetch();

		await client.invalidateQueries({
			queryKey: ['friends'],
		});
	}, [addFriendAsync, client, data, refetch]);

	const removeFriend = useCallback(async () => {
		if (!data) return;

		await removeFriendAsync({
			friendId: data.id,
		});

		await refetch();

		await client.invalidateQueries({
			queryKey: ['friends'],
		});
	}, [data, removeFriendAsync, refetch, client]);

	if (!data) {
		return <LoadingScreen message={'Loading profile...'} />;
	}

	return (
		<Page isLoading={isLoading} refetch={refetch}>
			<PageTitleWithImage
				title={`@${data.username}`}
				placeholderIcon={faUser}
				image={data.image}
				description={data.description}
			/>

			{data.isFriend ? (
				<Button content={'Remove Friend'} onPress={removeFriend} />
			) : (
				<Button content={'Add Friend'} onPress={addFriend} />
			)}
		</Page>
	);
}
