import {
    faChevronRight,
    faMagnifyingGlass,
    faPlus,
    faShelvesEmpty,
} from '@awesome.me/kit-34e2017de2/icons/duotone/solid';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {router} from 'expo-router';
import {useState} from 'react';
import {Animated, Pressable, RefreshControl, View} from 'react-native';
import {ExampleLists} from '../../assets/temp/ExampleLists';
import {Content} from '../../components';
import GamesDropdown from '../../components/GamesDropdown';
import {Input} from '../../components/Input';
import {ListImage} from '../../components/ListImage';
import {useColours} from '../../hooks/useColours';
import {Games} from '../../types';
import ScrollView = Animated.ScrollView;

export default function Lists() {
	const [game, setGame] = useState<string | undefined>(Games.All);
	const [isCreatingList, setIsCreatingList] = useState(false);
	const [search, setSearch] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const refetch = () => setIsLoading(true);
	const colours = useColours();
	const lists = ExampleLists;

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
						onPress={() => setIsCreatingList(true)}
					>
						<FontAwesomeIcon icon={faPlus} size={16} color={colours.primary} />
						<Content size={'xs'} type={'title'}>
							Create List
						</Content>
					</Pressable>
				</View>

				{lists.length === 0 ? (
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
						{lists.map((list) => (
							<Pressable
								key={`${list.id}`}
								className={'flex flex-row w-full gap-4 items-center'}
								onPress={() => {
									router.navigate(`/(tabs)/list?id=${list.id}`);
								}}
							>
								<ListImage list={list} />

								<View className={'flex flex-col'}>
									<Content type={'title'} size={'xs'}>
										{list.name}
									</Content>

									{list.army && (
										<Content type={'subtitle'} size={'md'} muted>
											{list.army}
										</Content>
									)}
								</View>

								<View className={'flex flex-col ml-auto'}>
									<Content type={'title'} size={'xs'}>
										{list.points}pts
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
				)}
			</ScrollView>
		</View>
	);
}
