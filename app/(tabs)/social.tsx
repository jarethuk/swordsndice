import {faMagnifyingGlass, faUser, faUsers,} from '@awesome.me/kit-34e2017de2/icons/duotone/solid';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {asc} from 'drizzle-orm';
import {useLiveQuery} from 'drizzle-orm/expo-sqlite';
import {useMemo, useState} from 'react';
import {Animated, RefreshControl, View} from 'react-native';
import {Content} from '../../components';
import {Input} from '../../components/Input';
import ListRow from '../../components/ListRow';
import {TabInput} from '../../components/TabInput';
import {Database} from '../../db/Database';
import {friends, groups} from '../../db/schema';
import {useColours} from '../../hooks/useColours';

import {useDebounce} from '../../hooks/useDebounce';
import ScrollView = Animated.ScrollView;

enum Tabs {
	Friends = 'friends',
	Groups = 'groups',
}

interface SearchResults {
	users: {
		id: string;
		username: string;
		image?: string;
	}[];
	groups: {
		id: string;
		name: string;
		image?: string;
	}[];
}

export default function Social() {
	const colours = useColours();
	const [search, setSearch] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const refetch = () => setIsLoading(true);
	const [tab, setTab] = useState<string>(Tabs.Friends);

	const { debouncedValue } = useDebounce(search, 300);

	const { data: dbFriends } = useLiveQuery(
		Database.db.select().from(friends).orderBy(asc(friends.username)),
	);

	const { data: dbGroups } = useLiveQuery(
		Database.db.select().from(groups).orderBy(asc(groups.name)),
	);

	const searchResults: SearchResults = useMemo(() => {
		return {
			users: [
				{
					id: '1',
					username: 'Joshua',
					image: 'https://avatars.githubusercontent.com/u/10055292?v=4',
				},
				{
					id: '2',
					username: 'Tim',
					image: 'https://avatars.githubusercontent.com/u/10055292?v=4',
				},
			],
			groups: [
				{
					id: '1',
					name: 'Group 1',
					image: 'https://avatars.githubusercontent.com/u/10055292?v=4',
				},
			],
		};
	}, [debouncedValue]);

	return (
		<View className={'flex flex-col gap-6 h-full'}>
			<Input
				placeholder={'Find friends & groups'}
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

			{!searchResults ? (
				<>
					<TabInput
						tabs={[
							{
								title: 'Friends',
								value: Tabs.Friends,
							},
							{
								title: 'Groups',
								value: Tabs.Groups,
							},
						]}
						selected={tab}
						onChange={setTab}
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
						contentContainerClassName={'pb-12 flex gap-6 h-full'}
					>
						{tab === Tabs.Friends &&
							(dbFriends.length > 0 ? (
								dbFriends.map((friend) => (
									<ListRow
										key={friend.username}
										title={friend.username}
										image={friend.image}
										placeHolderIcon={faUser}
									/>
								))
							) : (
								<View className={'h-full flex items-center justify-center'}>
									<Content size={'md'} type={'body'} center>
										Find friends using their username by searching above
									</Content>
								</View>
							))}

						{tab === Tabs.Groups &&
							(dbGroups.length > 0 ? (
								dbGroups.map((group) => (
									<ListRow
										key={group.name}
										title={group.name}
										image={group.image}
										placeHolderIcon={faUsers}
									/>
								))
							) : (
								<View className={'h-full flex items-center justify-center'}>
									<Content size={'md'} type={'body'} center>
										Find groups using their name by searching above
									</Content>
								</View>
							))}
					</ScrollView>
				</>
			) : (
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
					contentContainerClassName={'pb-12 flex gap-12 h-full'}
				>
					{!searchResults.users && !searchResults.groups && (
						<View className={'h-full flex items-center justify-center'}>
							<Content size={'md'} type={'body'} center>
								No users or groups found
							</Content>
						</View>
					)}

					{searchResults.users && (
						<View className={'flex gap-6'}>
							<Content type={'title'} size={'xs'}>
								Users
							</Content>

							{searchResults.users.map((user) => (
								<ListRow
									key={user.id}
									title={user.username}
									image={user.image}
									placeHolderIcon={faUsers}
								/>
							))}
						</View>
					)}

					{searchResults.groups && (
						<View className={'flex gap-6'}>
							<Content type={'title'} size={'xs'}>
								Groups
							</Content>

							{searchResults.groups.map((group) => (
								<ListRow
									key={group.id}
									title={group.name}
									image={group.image}
									placeHolderIcon={faUsers}
								/>
							))}
						</View>
					)}
				</ScrollView>
			)}
		</View>
	);
}
