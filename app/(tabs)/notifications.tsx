import {
	faFaceThinking,
	faSword,
	faUsers,
} from '@awesome.me/kit-6b5fd61d92/icons/duotone/solid';
import dayjs from 'dayjs';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useMemo } from 'react';
import { View } from 'react-native';
import { useAPIGameInvites } from '../../api/games/useAPIGameInvites';
import { useAPIGroupInvites } from '../../api/groups/useAPIGroupInvites';
import { Content } from '../../components/common/Content';
import { FAIcon } from '../../components/common/FAIcon';
import ListRow from '../../components/common/ListRow';
import { Page } from '../../components/common/Page';
import type { GameInviteResponse } from '../../types/api/responses/GameInviteResponse';
import type { UserGroupInvite } from '../../types/api/responses/UserGroupInvite';

interface NotificationItem {
	type: 'group-invite' | 'game-invite';
	createdAt: Date;
	data: GameInviteResponse | UserGroupInvite;
}

interface DateGroup {
	date: string;
	items: NotificationItem[];
}

interface GameInviteProps {
	game: GameInviteResponse;
}

interface GroupInviteProps {
	group: UserGroupInvite;
}

const GameInviteRow = ({ game }: GameInviteProps) => {
	return (
		<ListRow
			title={`Game invite from @${game.invitedBy.username}`}
			subtitle={`${game.game} (${game.points}pts)`}
			placeHolderIcon={faSword}
			onPress={() =>
				router.push({
					pathname: '/modals/notification-game-invite',
					params: { id: game.id },
				})
			}
		/>
	);
};

const GroupInviteRow = ({ group }: GroupInviteProps) => {
	return (
		<ListRow
			title={`Invite to join group ${group.name} by @${group.createdBy.username}`}
			placeHolderIcon={faUsers}
			image={group.image}
			onPress={() =>
				router.push({
					pathname: '/modals/notification-group-invite',
					params: { id: group.id },
				})
			}
		/>
	);
};

const getItemRender = (item: NotificationItem) => {
	switch (item.type) {
		case 'game-invite':
			return (
				<GameInviteRow
					game={item.data as GameInviteResponse}
					key={item.data.id}
				/>
			);

		case 'group-invite':
			return (
				<GroupInviteRow
					group={item.data as UserGroupInvite}
					key={item.data.id}
				/>
			);
	}
};

export default function Notifications() {
	const {
		data: gameInvites,
		refetch: gameInvitesRefetch,
		isLoading: gameInvitesLoading,
	} = useAPIGameInvites();

	const {
		data: groupInvites,
		refetch: groupInvitesRefetch,
		isLoading: groupInvitesLoading,
	} = useAPIGroupInvites();

	const isLoading = gameInvitesLoading || groupInvitesLoading;

	const refresh = useCallback(async () => {
		await Promise.all([gameInvitesRefetch(), groupInvitesRefetch()]);
	}, [gameInvitesRefetch, groupInvitesRefetch]);

	useFocusEffect(() => refresh);

	const items: NotificationItem[] = useMemo(() => {
		if (!gameInvites || !groupInvites) return [];

		const gameInviteItems: NotificationItem[] = gameInvites.map((x) => ({
			id: x.id,
			type: 'game-invite',
			createdAt: x.createdAt,
			data: x,
		}));

		const groupInviteItems: NotificationItem[] = groupInvites.map((x) => ({
			id: x.id,
			type: 'group-invite',
			createdAt: x.createdAt,
			data: x,
		}));

		return [...gameInviteItems, ...groupInviteItems].sort((a, b) =>
			dayjs(b.createdAt).isBefore(a.createdAt) ? 1 : -1,
		);
	}, [gameInvites, groupInvites]);

	const groups: DateGroup[] = useMemo(() => {
		if (!items?.length) return [];

		return items.reduce((acc: DateGroup[], item: NotificationItem) => {
			const date = dayjs(item.createdAt).format('DD MMM YYYY');
			const group = acc.find((x) => x.date === date);

			if (group) {
				group.items.push(item);
			} else {
				acc.push({ date, items: [item] });
			}

			return acc;
		}, []);
	}, [items]);

	return (
		<Page
			isLoading={isLoading}
			refetch={refresh}
			title={'Notifications'}
			subtitle={
				'Game & group invites will appear here as well as any other notifications.'
			}
		>
			{groups.map(({ date, items }) => (
				<View key={date} className={'flex flex-col gap-6'}>
					<Content size={'md'} type={'subtitle'}>
						{date}
					</Content>

					<View className={'flex flex-col gap-8'}>
						{items.map((item) => getItemRender(item))}
					</View>
				</View>
			))}

			{groups.length === 0 && (
				<View className={'flex h-96 items-center justify-center gap-6'}>
					<FAIcon icon={faFaceThinking} colour="primary" size={32} />
					<Content size={'lg'} type={'subtitle'}>
						No notifications yet!
					</Content>
				</View>
			)}
		</Page>
	);
}
