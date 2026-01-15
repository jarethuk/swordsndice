import {
	faUser,
	faUsers,
} from '@awesome.me/kit-34e2017de2/icons/duotone/solid';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useMemo } from 'react';
import { useAPIGroup } from '../../api/groups/useAPIGroup';
import { Content } from '../../components';
import { Button } from '../../components/Button';
import ListRow from '../../components/ListRow';
import { LoadingScreen } from '../../components/LoadingScreen';
import { Page } from '../../components/Page';
import { PageTitleWithImage } from '../../components/PageTitleWithImage';
import { useUser } from '../../states/useUserStore';

export default function GroupPage() {
	const { id } = useLocalSearchParams();
	const user = useUser();
	const { data, refetch, isLoading } = useAPIGroup(id as string);

	const isAdmin = useMemo(() => {
		return (
			data?.members.find((x) => x.username === user?.username)?.isAdmin ?? false
		);
	}, [user, data]);

	useFocusEffect(
		useCallback(() => {
			void refetch();
		}, [refetch]),
	);

	if (!data) {
		return <LoadingScreen message={'Loading group...'} />;
	}

	if (!data) {
		return <LoadingScreen message={'Loading group...'} />;
	}

	return (
		<Page isLoading={isLoading} refetch={refetch}>
			<PageTitleWithImage
				title={data.name}
				image={data.image}
				description={data.description}
				placeholderIcon={faUsers}
				onEdit={
					isAdmin
						? () =>
								router.navigate({
									pathname: '/modals/edit-group',
									params: {
										id,
									},
								})
						: undefined
				}
			/>

			<Content type={'subtitle'} size={'md'}>
				Members ({data.members.length})
			</Content>

			{data.members.map((member) => (
				<ListRow
					key={member.username}
					title={`@${member.username ?? ''} ${member.isAdmin ? '(Admin)' : ''}`}
					image={member.image}
					placeHolderIcon={faUser}
					onPress={() =>
						isAdmin
							? router.navigate({
									pathname: '/modals/group-member',
									params: { id: member.id, groupId: data.id },
								})
							: router.push({
									pathname: '/(tabs)/friend',
									params: { username: member.username },
								})
					}
				/>
			))}

			{data.invites.length > 0 && (
				<>
					<Content type={'subtitle'} size={'md'}>
						Invited ({data.invites.length})
					</Content>

					{data.invites.map(({ user }) => (
						<ListRow
							key={user.username}
							title={`@${user.username}`}
							image={user.image}
							placeHolderIcon={faUser}
							onPress={() =>
								isAdmin
									? router.navigate({
											pathname: '/modals/group-invite',
											params: { id: user.id, groupId: data.id },
										})
									: router.push({
											pathname: '/(tabs)/friend',
											params: { username: user.username },
										})
							}
						/>
					))}
				</>
			)}

			<Button
				content={'Invite Member'}
				onPress={() =>
					router.navigate({
						pathname: '/modals/invite-to-group',
						params: { id: id as string },
					})
				}
			/>
		</Page>
	);
}
