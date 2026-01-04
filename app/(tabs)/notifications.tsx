import { faSword, faUsers, } from '@awesome.me/kit-34e2017de2/icons/duotone/solid';
import { useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { router } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Animated, RefreshControl, View } from 'react-native';
import { useAPIAcceptGameInvite } from '../../api/games/useAPIAcceptGameInvite';
import { useAPIDeclineGame } from '../../api/games/useAPIDeclineGame';
import { useAPIGameInvites } from '../../api/games/useAPIGameInvites';
import { useAPIDeclineGroupInvite } from '../../api/groups/useAPIDeclineGroupInvite';
import { useAPIGroupInvites } from '../../api/groups/useAPIGroupInvites';
import { useAPIJoinGroup } from '../../api/groups/useAPIJoinGroup';
import { Content } from '../../components';
import { Button } from '../../components/Button';
import ListRow from '../../components/ListRow';
import { Popup } from '../../components/Popup';
import { useColours } from '../../hooks/useColours';
import type { GameInviteResponse } from '../../types/api/responses/GameInviteResponse';
import type { UserGroupInvite } from '../../types/api/responses/UserGroupInvite';
import ScrollView = Animated.ScrollView;

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
	refresh: () => Promise<void>;
}

interface GroupInviteProps {
	group: UserGroupInvite;
	refresh: () => Promise<void>;
}

const GameInviteRow = ({ game, refresh }: GameInviteProps) => {
	const [selected, setSelected] = useState(false);
	const client = useQueryClient();

	const { mutateAsync: apiAccept } = useAPIAcceptGameInvite();
	const { mutateAsync: apIDecline } = useAPIDeclineGame();

	const accept = useCallback(async () => {
		setSelected(false);

		await apiAccept(game.id);

		await client.invalidateQueries({
			queryKey: ['games'],
		});

		void refresh();

		router.push({ pathname: '/(tabs)/game', params: { id: game.id } });
	}, [apiAccept, client, game.id, refresh]);

	const decline = useCallback(async () => {
		setSelected(false);
		await apIDecline(game.id);
		await refresh();
	}, [apIDecline, game.id, refresh]);

	return (
		<>
			<ListRow
				title={`Game invite from ${game.invitedBy.username}`}
				placeHolderIcon={faSword}
				onPress={() => setSelected(true)}
			/>

			{selected && (
				<Popup onDismiss={() => setSelected(false)}>
					<View className={'flex flex-col gap-8'}>
						<View className={'flex flex-col gap-4'}>
							<Content size={'sm'} type={'title'} center>
								Accept game invite from {game.invitedBy.username}?
							</Content>

							<Content size={'sm'} type={'subtitle'} center>
								{game.game} ({game.points}pts)
							</Content>
						</View>

						<View className={'flex flex-col gap-4'}>
							<Button content={'Accept'} onPress={accept} variant={'primary'} />
							<Button
								content={'Decline'}
								onPress={decline}
								variant={'outline'}
							/>
						</View>
					</View>
				</Popup>
			)}
		</>
	);
};

const GroupInviteRow = ({ group, refresh }: GroupInviteProps) => {
	const [selected, setSelected] = useState(false);
	const client = useQueryClient();

	const { mutateAsync: apiAccept } = useAPIJoinGroup(group.id);
	const { mutateAsync: apIDecline } = useAPIDeclineGroupInvite(group.id);

	const accept = useCallback(async () => {
		setSelected(false);

		await apiAccept();

		await client.invalidateQueries({
			queryKey: ['groups'],
		});

		void refresh();

		router.push({ pathname: '/(tabs)/group', params: { id: group.id } });
	}, [apiAccept, client, group.id, refresh]);

	const decline = useCallback(async () => {
		setSelected(false);
		await apIDecline();
		await refresh();
	}, [apIDecline, refresh]);

	return (
		<>
			<ListRow
				title={`Invite to join group ${group.name} by ${group.createdBy.username}`}
				placeHolderIcon={faUsers}
				image={group.image}
				onPress={() => setSelected(true)}
			/>

			{selected && (
				<Popup onDismiss={() => setSelected(false)}>
					<View className={'flex flex-col gap-8'}>
						<View className={'flex flex-col gap-4'}>
							<Content size={'sm'} type={'title'} center>
								Accept invite to {group.name}?
							</Content>
						</View>

						<View className={'flex flex-col gap-4'}>
							<Button content={'Accept'} onPress={accept} variant={'primary'} />
							<Button
								content={'Decline'}
								onPress={decline}
								variant={'outline'}
							/>
						</View>
					</View>
				</Popup>
			)}
		</>
	);
};

const getItemRender = (
	item: NotificationItem,
	refresh: () => Promise<void>,
) => {
	switch (item.type) {
		case 'game-invite':
			return (
				<GameInviteRow
					game={item.data as GameInviteResponse}
					key={item.data.id}
					refresh={refresh}
				/>
			);

		case 'group-invite':
			return (
				<GroupInviteRow
					group={item.data as UserGroupInvite}
					key={item.data.id}
					refresh={refresh}
				/>
			);
	}
};

export default function Notifications() {
	const colours = useColours();
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
		<ScrollView
			contentContainerClassName={'flex h-full flex-col gap-12 pb-12'}
			refreshControl={
				<RefreshControl
					refreshing={isLoading}
					onRefresh={refresh}
					colors={[colours.primary]}
				/>
			}
		>
			<View className={'flex gap-4'}>
				<Content size={'md'} type={'title'} center>
					Notifications
				</Content>

				<Content size={'md'} type={'body'} center>
					Game &amp; group invites will appear here as well as any other
					notifications.
				</Content>
			</View>

			{groups.map(({ date, items }) => (
				<View key={date} className={'flex flex-col gap-6'}>
					<Content size={'md'} type={'subtitle'}>
						{date}
					</Content>

					<View className={'flex flex-col gap-8'}>
						{items.map((item) => getItemRender(item, refresh))}
					</View>
				</View>
			))}
		</ScrollView>
	);
}
