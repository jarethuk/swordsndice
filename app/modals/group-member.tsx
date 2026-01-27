import { useQueryClient } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useMemo } from 'react';
import { View } from 'react-native';
import { useAPIGroup } from '../../api/groups/useAPIGroup';
import { useAPIRemoveMemberFromGroup } from '../../api/groups/useAPIRemoveMemberFromGroup';
import { useAPIUpdateGroupMember } from '../../api/groups/useAPIUpdateGroupMember';
import { Button } from '../../components/common/Button';
import { Dialog } from '../../components/common/Dialog';
import { LoadingScreen } from '../../components/common/LoadingScreen';
import type { UpdateGroupMemberRequest } from '../../types/api/requests/UpdateGroupMemberRequest';

export default function GroupMemberDialog() {
	const { id, groupId } = useLocalSearchParams();
	const { data, isLoading } = useAPIGroup(groupId as string);
	const client = useQueryClient();

	const member = useMemo(() => {
		return data?.members.find((x) => x.id === id);
	}, [data, id]);

	const { mutateAsync: apiRemoveMember } = useAPIRemoveMemberFromGroup(
		groupId as string,
	);
	const { mutateAsync: apiUpdateMember } = useAPIUpdateGroupMember(
		groupId as string,
	);

	const removeMember = useCallback(async () => {
		if (!member) return;

		await apiRemoveMember(member.id);

		await client.invalidateQueries({
			queryKey: ['group', groupId],
		});

		router.dismiss();
	}, [apiRemoveMember, client, groupId, member]);

	const updateMember = useCallback(
		async (request: UpdateGroupMemberRequest) => {
			if (!member) return;

			await apiUpdateMember({
				...request,
				id: member.id,
			});

			await client.invalidateQueries({
				queryKey: ['group', groupId],
			});

			router.dismiss();
		},
		[apiUpdateMember, client, groupId, member],
	);

	if (isLoading) return <LoadingScreen message={'Loading group member...'} />;

	if (!member) return null;

	return (
		<Dialog title={'Manage Member'} subtitle={`@${member.username}`}>
			<View className={'flex flex-col items-center gap-4'}>
				<Button
					content={'View Profile'}
					onPress={() => {
						router.navigate({
							pathname: '/(tabs)/friend',
							params: { username: member.username },
						});
					}}
				/>

				<View className={'flex w-full flex-row items-center gap-2'}>
					<View className={'grow'}>
						<Button
							content={'Remove Member'}
							variant={'negative'}
							onPress={removeMember}
						/>
					</View>

					{member.isAdmin ? (
						<View className={'grow'}>
							<Button
								content={'Revoke Admin'}
								variant={'outline'}
								onPress={() =>
									updateMember({
										isAdmin: false,
									})
								}
							/>
						</View>
					) : (
						<View className={'grow'}>
							<Button
								content={'Make Admin'}
								variant={'outline'}
								onPress={() =>
									updateMember({
										isAdmin: true,
									})
								}
							/>
						</View>
					)}
				</View>
			</View>
		</Dialog>
	);
}
