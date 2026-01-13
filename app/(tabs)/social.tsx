import {
	faMagnifyingGlass,
	faUser,
	faUsers,
} from '@awesome.me/kit-34e2017de2/icons/duotone/solid';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Animated, RefreshControl, View } from 'react-native';
import { useAPIFindFriend } from '../../api/friends/useAPIFindFriend';
import { useAPIFriends } from '../../api/friends/useAPIFriends';
import { useAPIFindGroup } from '../../api/groups/useAPIFindGroup';
import { useAPIGroups } from '../../api/groups/useAPIGroups';
import { Content } from '../../components';
import { Button } from '../../components/Button';
import { Container } from '../../components/Container';
import { Input } from '../../components/Input';
import ListRow from '../../components/ListRow';
import { LoadingScreen } from '../../components/LoadingScreen';
import { Page } from '../../components/Page';
import { TabInput } from '../../components/TabInput';
import { useColours } from '../../hooks/useColours';
import { useDebounce } from '../../hooks/useDebounce';

import ScrollView = Animated.ScrollView;

enum Tabs {
	Friends = 'friends',
	Groups = 'groups',
}

export default function Social() {
	const colours = useColours();
	const [search, setSearch] = useState('');
	const [tab, setTab] = useState<string>(Tabs.Friends);

	const { debouncedValue } = useDebounce(search, 300);
	const { data: searchFriends } = useAPIFindFriend(debouncedValue);
	const { data: searchGroups } = useAPIFindGroup(debouncedValue);

	const {
		data: friends,
		refetch: refreshFriends,
		isLoading: friendsLoading,
	} = useAPIFriends();
	const {
		data: groups,
		refetch: refreshGroups,
		isLoading: groupsLoading,
	} = useAPIGroups();

	const isLoading = friendsLoading || groupsLoading;

	const refetch = useCallback(() => {
		void refreshFriends();
		void refreshGroups();
	}, [refreshFriends, refreshGroups]);

	useFocusEffect(() => {
		setSearch('');
	});

	if (!friends || !groups) {
		return <LoadingScreen message={'Loading friends & groups...'} />;
	}

	return (
		<Container>
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

			{!debouncedValue ? (
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
							(friends.length > 0 ? (
								friends.map((friend) => (
									<ListRow
										key={friend.username}
										title={friend.username}
										image={friend.image}
										placeHolderIcon={faUser}
										onPress={() =>
											router.push({
												pathname: '/(tabs)/friend',
												params: {
													username: friend.username,
												},
											})
										}
									/>
								))
							) : (
								<View className={'flex h-full items-center justify-center'}>
									<Content size={'md'} type={'body'} center>
										Find friends using their username by searching above
									</Content>
								</View>
							))}

						{tab === Tabs.Groups &&
							(groups.length > 0 ? (
								groups.map((group) => (
									<ListRow
										key={group.id}
										title={group.name}
										image={group.image}
										placeHolderIcon={faUsers}
										onPress={() =>
											router.push({
												pathname: '/(tabs)/group',
												params: {
													id: group.id,
												},
											})
										}
									/>
								))
							) : (
								<View
									className={'flex h-full items-center justify-center gap-6'}
								>
									<Content size={'md'} type={'body'} center>
										Find groups using their name by searching above or create
										your own
									</Content>

									<Button
										content={'Create Group'}
										onPress={() => router.navigate('/modals/create-group')}
									/>
								</View>
							))}
					</ScrollView>
				</>
			) : (
				<Page isLoading={isLoading} refetch={refetch}>
					{!searchFriends && !searchGroups && (
						<View className={'flex h-full items-center justify-center'}>
							<Content size={'md'} type={'body'} center>
								No users or groups found
							</Content>
						</View>
					)}

					{!!searchFriends?.length && (
						<View className={'flex gap-6'}>
							<Content type={'title'} size={'xs'}>
								Users
							</Content>

							{searchFriends.map((user) => (
								<ListRow
									key={user.id}
									title={user.username}
									image={user.image}
									placeHolderIcon={faUsers}
									onPress={() =>
										router.push({
											pathname: '/(tabs)/friend',
											params: {
												username: user.username,
											},
										})
									}
								/>
							))}
						</View>
					)}

					{!!searchGroups?.length && (
						<View className={'flex gap-6'}>
							<Content type={'title'} size={'xs'}>
								Groups
							</Content>

							{searchGroups.map((group) => (
								<ListRow
									key={group.id}
									title={group.name}
									image={group.image}
									placeHolderIcon={faUsers}
								/>
							))}
						</View>
					)}
				</Page>
			)}
		</Container>
	);
}
