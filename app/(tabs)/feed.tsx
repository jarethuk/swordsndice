import {
	faSwords,
	faUserPlus,
	faUsers,
} from '@awesome.me/kit-34e2017de2/icons/duotone/solid';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import dayjs from 'dayjs';
import { router } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { View } from 'react-native';
import { useAPIFeed } from '../../api/feed/useAPIFeed';
import { useAPIGames } from '../../api/games/useAPIGames';
import { Content } from '../../components';
import { Container } from '../../components/Container';
import GameRow from '../../components/GameRow';
import ListRow from '../../components/ListRow';
import { LoadingScreen } from '../../components/LoadingScreen';
import { Page } from '../../components/Page';
import { PageTitle } from '../../components/PageTitle';
import { TabInput } from '../../components/TabInput';
import {
	type FeedItem,
	FeedItemTypes,
} from '../../types/api/responses/FeedItem';
import type { GameListResponse } from '../../types/api/responses/GameListResponse';

enum Tabs {
	Feed = 'feed',
	MyGames = 'my-games',
}

interface DateGroup {
	date: string;
	items: GameListResponse[];
}

interface MyGamesTabProps {
	data: GameListResponse[];
	isLoading: boolean;
	refetch: () => void;
}

interface FeedTabProps {
	data: FeedItem[];
	isLoading: boolean;
	refetch: () => void;
}

const MyGamesTab = ({ data, isLoading, refetch }: MyGamesTabProps) => {
	const groups: DateGroup[] = useMemo(() => {
		if (!data?.length) return [];

		return data.reduce((acc: DateGroup[], game: GameListResponse) => {
			const date = dayjs(game.createdAt).format('DD MMM YYYY');
			const group = acc.find((x) => x.date === date);

			if (group) {
				group.items.push(game);
			} else {
				acc.push({ date, items: [game] });
			}

			return acc;
		}, []);
	}, [data]);

	if (!data) {
		return <LoadingScreen message={'Loading games...'} />;
	}

	return (
		<Page isLoading={isLoading} refetch={refetch}>
			{groups.map(({ date, items }) => (
				<View key={date} className={'flex flex-col gap-6'}>
					<Content size={'md'} type={'subtitle'}>
						{date}
					</Content>

					{items.map((item) => (
						<GameRow key={item.id} item={item} />
					))}
				</View>
			))}

			{groups.length === 0 && (
				<View className={'flex h-full items-center justify-center'}>
					<Content size={'md'} type={'body'} center>
						You haven&apos;t created any games yet.
					</Content>
				</View>
			)}
		</Page>
	);
};

const getPlaceholderIcon = (item: FeedItem): IconDefinition => {
	switch (item.type) {
		case FeedItemTypes.FriendAdded:
			return faUserPlus;
		case FeedItemTypes.GroupCreated:
		case FeedItemTypes.GroupJoined:
			return faUsers;
		default:
			return faSwords;
	}
};

const FeedTab = ({ data, isLoading, refetch }: FeedTabProps) => {
	if (!data) {
		return <LoadingScreen message={'Loading feed...'} />;
	}

	const onItemPress = (item: FeedItem) => {
		switch (item.type) {
			case FeedItemTypes.FriendAdded:
				router.navigate({
					pathname: '/(tabs)/friend',
					params: {
						id: item.id,
					},
				});
				break;

			case FeedItemTypes.GroupCreated:
			case FeedItemTypes.GroupJoined:
				router.navigate({
					pathname: '/(tabs)/group',
					params: {
						id: item.id,
					},
				});
				break;

			case FeedItemTypes.GameStarted:
			case FeedItemTypes.GameCompleted:
				router.navigate({
					pathname: '/(tabs)/game',
					params: {
						id: item.id,
					},
				});
				break;
		}
	};

	return (
		<Page isLoading={isLoading} refetch={refetch}>
			<View className={'flex gap-8'}>
				{data.map((item) => (
					<ListRow
						key={item.id}
						title={item.title}
						subtitle={item.subTitle}
						image={item.image}
						placeHolderIcon={getPlaceholderIcon(item)}
						onPress={() => onItemPress(item)}
					/>
				))}
			</View>

			{data.length === 0 && (
				<View className={'flex h-full items-center justify-center'}>
					<Content size={'md'} type={'body'} center>
						Games, groups and friend activity will show here
					</Content>
				</View>
			)}
		</Page>
	);
};

export default function Feed() {
	const [tab, setTab] = useState<string>(Tabs.MyGames);

	const {
		data: games,
		refetch: gamesRefetch,
		isLoading: gamesLoading,
	} = useAPIGames();
	const {
		data: feedItems,
		isLoading: feedLoading,
		refetch: feedRefetch,
	} = useAPIFeed();

	const refetch = useCallback(async () => {
		await Promise.all([gamesRefetch(), feedRefetch()]);
	}, [feedRefetch, gamesRefetch]);

	const isLoading = gamesLoading || feedLoading;

	if (!games || !feedItems)
		return <LoadingScreen message={'Loading activity...'} />;

	return (
		<Container>
			<PageTitle title={'Recent Activity'} refetch={refetch} />

			<TabInput
				selected={tab}
				tabs={[
					{
						title: 'My Games',
						value: Tabs.MyGames,
					},
					{
						title: 'Feed',
						value: Tabs.Feed,
					},
				]}
				onChange={setTab}
			/>

			{tab === Tabs.MyGames && (
				<MyGamesTab data={games} isLoading={isLoading} refetch={refetch} />
			)}

			{tab === Tabs.Feed && (
				<FeedTab data={feedItems} isLoading={isLoading} refetch={refetch} />
			)}
		</Container>
	);
}
