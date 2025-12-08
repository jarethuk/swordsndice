import {faMagnifyingGlass, faUser, faUsers,} from '@awesome.me/kit-34e2017de2/icons/duotone/solid';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {useState} from 'react';
import {Animated, RefreshControl, View} from 'react-native';
import {Input} from '../../components/Input';
import ListRow from '../../components/ListRow';
import {TabInput} from '../../components/TabInput';
import {useColours} from '../../hooks/useColours';
import type {Friend} from '../../types/Friend';
import type {Group} from '../../types/Group';
import ScrollView = Animated.ScrollView;

const friends: Friend[] = [
	{
		username: 'Alice',
	},
	{
		username: 'Bob',
	},
	{
		username: 'Charlie',
	},
];

const groups: Group[] = [
	{
		id: '1',
		name: 'Amazing group 1',
		admins: ['Alice'],
	},
	{
		id: '2',
		name: 'Amazing group 2',
		admins: ['Alice'],
	},
	{
		id: '3',
		name: 'Amazing group 3',
		admins: ['Alice'],
	},
];

enum Tabs {
	Friends = 'friends',
	Groups = 'groups',
}

export default function Social() {
	const colours = useColours();
	const [search, setSearch] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const refetch = () => setIsLoading(true);
	const [tab, setTab] = useState<string>(Tabs.Friends);

	return (
		<View className={'flex flex-col gap-4 h-full'}>
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
				contentContainerClassName={'pb-12 flex gap-6'}
			>
				{tab === Tabs.Friends &&
					friends.map((friend) => (
						<ListRow
							key={friend.username}
							title={friend.username}
							image={friend.image}
							placeHolderIcon={faUser}
						/>
					))}

				{tab === Tabs.Groups &&
					groups.map((group) => (
						<ListRow
							key={group.name}
							title={group.name}
							image={group.image}
							placeHolderIcon={faUsers}
						/>
					))}
			</ScrollView>
		</View>
	);
}
