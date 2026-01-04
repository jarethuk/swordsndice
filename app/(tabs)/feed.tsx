import { faChevronRight, faSwords, } from '@awesome.me/kit-34e2017de2/icons/duotone/solid';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import dayjs from 'dayjs';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Animated, Pressable, RefreshControl, View } from 'react-native';
import { useAPIGames } from '../../api/games/useAPIGames';
import { Content } from '../../components';
import { ListImage } from '../../components/ListImage';
import { LoadingScreen } from '../../components/LoadingScreen';
import { TabInput } from '../../components/TabInput';
import { useColours } from '../../hooks/useColours';
import type { GameListResponse } from '../../types/api/responses/GameListResponse';
import type { GameResponse } from '../../types/api/responses/GameResponse';
import ScrollView = Animated.ScrollView;

enum Tabs {
	Feed = 'feed',
	MyGames = 'my-games',
}

interface DateGroup {
	date: string;
	items: GameResponse[];
}

const FeedTab = () => {
	return <></>;
};

const getGameTitle = (game: GameListResponse): string => {
	console.log(game);
	if (game.members && game.members.length > 0) {
		if (game.members.every((x) => x.army)) {
			return game.members.map((x) => x.army).join(' vs ');
		}

		return game.members.map((x) => x.username).join(' vs ');
	}

	return `${game.game} (${game.points} points)`;
};

const MyGamesTab = () => {
	const colours = useColours();
	const { data, refetch, isLoading } = useAPIGames();

	const groups: DateGroup[] = useMemo(() => {
		if (!data?.length) return [];

		const groups = data.reduce((acc: DateGroup[], game: GameResponse) => {
			const date = dayjs(game.createdAt).format('DD MMM YYYY');
			const group = acc.find((x) => x.date === date);

			if (group) {
				group.items.push(game);
			} else {
				acc.push({ date, items: [game] });
			}

			return acc;
		}, []);

		return groups;
	}, [data]);

	if (!data) {
		return <LoadingScreen message={'Loading games...'} />;
	}

	return (
		<ScrollView
			contentContainerClassName={'flex flex-col gap-12 h-full pb-12'}
			refreshControl={
				<RefreshControl
					refreshing={isLoading}
					onRefresh={refetch}
					colors={[colours.primary]}
				/>
			}
		>
			{groups.map(({ date, items }) => (
				<View key={date} className={'flex flex-col gap-6'}>
					<Content size={'md'} type={'subtitle'}>
						{date}
					</Content>

					{items.map((item) => (
						<Pressable
							key={item.id}
							className={
								'border-border-light dark:border-border-dark flex w-full flex-row items-center gap-4 rounded-2xl border-2 p-4'
							}
							onPress={() =>
								router.push({
									pathname: '/(tabs)/game',
									params: {
										id: item.id,
									},
								})
							}
						>
							<ListImage image={item.image} placeHolderIcon={faSwords} />

							<View className={'flex grow'}>
								<Content type={'title'} size={'xs'}>
									{getGameTitle(item)}
								</Content>

								<Content type={'subtitle'} size={'md'} muted>
									{item.game} ({item.points}pts)
								</Content>
							</View>

							<FontAwesomeIcon
								icon={faChevronRight}
								size={16}
								color={colours.text}
							/>
						</Pressable>
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
		</ScrollView>
	);
};

export default function Feed() {
	const [tab, setTab] = useState<string>(Tabs.MyGames);

	return (
		<View className={'flex h-full flex-col gap-12 pb-12'}>
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

			{tab === Tabs.MyGames && <MyGamesTab />}
		</View>
	);
}
