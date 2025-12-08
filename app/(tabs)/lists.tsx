import {faMagnifyingGlass, faPlus, faShelvesEmpty, faSword,} from '@awesome.me/kit-34e2017de2/icons/duotone/solid';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {useLiveQuery} from 'drizzle-orm/expo-sqlite';
import {router} from 'expo-router';
import {useState} from 'react';
import {Animated, Pressable, RefreshControl, View} from 'react-native';
import {Content} from '../../components';
import GamesDropdown from '../../components/GamesDropdown';
import {Input} from '../../components/Input';
import ListRow from '../../components/ListRow';
import {Database} from '../../db/Database';
import {lists} from '../../db/schema';
import {useColours} from '../../hooks/useColours';

import {eq} from 'drizzle-orm';
import ScrollView = Animated.ScrollView;

export default function Lists() {
	const [game, setGame] = useState<string>('');
	const [search, setSearch] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const refetch = () => setIsLoading(true);
	const colours = useColours();
	const { data } = useLiveQuery(
		Database.db.select().from(lists).where(eq(lists.isDeleted, false)),
	);

	return (
		<View className={'flex flex-col gap-4 h-full'}>
			<Input
				placeholder={'Find list'}
				value={search}
				onChange={setSearch}
				type={'search'}
				iconStart={
					<FontAwesomeIcon
						icon={faMagnifyingGlass}
						size={16}
						color={colours.primary}
					/>
				}
			/>

			<ScrollView
				className={'w-full shrink pt-2'}
				refreshControl={
					<RefreshControl
						refreshing={isLoading}
						onRefresh={refetch}
						colors={[colours.primary]}
					/>
				}
				showsVerticalScrollIndicator={false}
				contentContainerClassName={'pb-12 flex gap-6'}
			>
				<View className={'flex flex-row w-full'}>
					<GamesDropdown selected={game} onChange={setGame} />

					<Pressable
						className={'flex flex-row gap-3 items-center ml-auto'}
						onPress={() => {
							router.navigate('/(tabs)/create-list');
						}}
					>
						<FontAwesomeIcon icon={faPlus} size={16} color={colours.primary} />
						<Content size={'xs'} type={'title'}>
							Create List
						</Content>
					</Pressable>
				</View>

				{data.length === 0 ? (
					<View className={'h-96 flex items-center justify-center gap-6'}>
						<FontAwesomeIcon
							icon={faShelvesEmpty}
							color={colours.primary}
							size={32}
						/>
						<Content size={'lg'} type={'subtitle'}>
							Create your first list to get started
						</Content>
					</View>
				) : (
					<View className={'flex gap-6'}>
						{data.map((list) => (
							<ListRow
								key={`${list.id}`}
								title={list.name}
								image={list.image}
								right={`${list.points}pts`}
								subtitle={list.army}
								onPress={() =>
									router.navigate({
										pathname: `/(tabs)/list`,
										params: {
											id: list.id,
										},
									})
								}
								placeHolderIcon={faSword}
							/>
						))}
					</View>
				)}
			</ScrollView>
		</View>
	);
}
