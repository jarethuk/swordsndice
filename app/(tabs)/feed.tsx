import {faChevronRight, faSwords,} from '@awesome.me/kit-34e2017de2/icons/duotone/solid';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import dayjs from 'dayjs';
import {desc} from 'drizzle-orm';
import {useLiveQuery} from 'drizzle-orm/expo-sqlite';
import {useMemo, useState} from 'react';
import {Animated, Pressable, View} from 'react-native';
import {Content} from '../../components';
import {ListImage} from '../../components/ListImage';
import {LoadingScreen} from '../../components/LoadingScreen';
import {TabInput} from '../../components/TabInput';
import {Database} from '../../db/Database';
import {games} from '../../db/schema';
import {useColours} from '../../hooks/useColours';
import type {Game} from '../../types/Game';
import {router} from 'expo-router';
import ScrollView = Animated.ScrollView;

enum Tabs {
	Feed = 'feed',
	MyGames = 'my-games',
}

interface DateGroup {
	date: string;
	items: Game[];
}

const FeedTab = () => {
	return <></>;
};

const getGameTitle = (game: Game): string => {
	if (game.members.length > 0) {
		if (game.members.every((x) => x.list)) {
			return game.members.map((x) => x.list?.army).join(' vs ');
		}

		return game.members.map((x) => x.username).join(' vs ');
	}

	return `${game.game} (${game.points} points)`;
};

const MyGamesTab = () => {
	const colours = useColours();
	const { data } = useLiveQuery(
		Database.db.select().from(games).orderBy(desc(games.createdAt)),
	);

	const groups: DateGroup[] = useMemo(() => {
		if (!data?.length) return [];

		const sorted = data.map(
			(x) =>
				({
					...x,
					members: JSON.parse(x.members),
				}) as Game,
		);

		const groups = sorted.reduce((acc: DateGroup[], game: Game) => {
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
		return <LoadingScreen />;
	}

	if (data.length === 0)
		return (
			<View className={'h-full flex items-center justify-center'}>
				<Content size={'md'} type={'body'} center>
					You haven't created any games yet.
				</Content>
			</View>
		);

	return groups.map(({ date, items }) => (
		<View key={date} className={'flex flex-col gap-6'}>
			<Content size={'md'} type={'subtitle'}>
				{date}
			</Content>

			{items.map((item) => (
				<Pressable
					key={item.id}
					className={
						'flex flex-row w-full gap-4 items-center border-2 border-border-light dark:border-border-dark p-4 rounded-2xl'
					}
					onPress={() =>
						router.navigate({
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
	));
};

export default function Feed() {
	const [tab, setTab] = useState<string>(Tabs.MyGames);

	return (
		<ScrollView contentContainerClassName={'flex flex-col gap-12 h-full pb-12'}>
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
		</ScrollView>
	);
}
