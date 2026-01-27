import {
	faMagnifyingGlass,
	faUser,
} from '@awesome.me/kit-6b5fd61d92/icons/duotone/solid';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { useAPIFriends } from '../../api/friends/useAPIFriends';
import { useAPIGame } from '../../api/games/useAPIGame';
import { useAPIInviteToGame } from '../../api/games/useAPIInviteToGame';
import { Content } from '../../components';
import { Dialog } from '../../components/Dialog';
import { FAIcon } from '../../components/FAIcon';
import { Input } from '../../components/Input';
import ListRow from '../../components/ListRow';

export default function InviteToGame() {
	const { id } = useLocalSearchParams();
	const [search, setSearch] = useState('');
	const { data } = useAPIFriends();
	const { data: game } = useAPIGame(id as string);

	const { mutateAsync: invite } = useAPIInviteToGame(id as string);

	const friends = useMemo(() => {
		if (!data || !game) return [];

		const lowered = search.toLowerCase();

		const alreadyAdded = [
			...(game.invites?.map((x) => x.username) ?? []),
			game.members.map((x) => x.user?.username),
		];

		const filteredFriends = data.filter(
			(x) => !alreadyAdded.includes(x.username),
		);

		return search
			? filteredFriends.filter((x) =>
					x.username.toLowerCase().includes(lowered),
				)
			: filteredFriends;
	}, [data, game, search]);

	const addMember = useCallback(
		async (id: string) => {
			await invite({
				friendId: id,
			});

			router.back();
		},
		[invite],
	);

	return (
		<Dialog title={'Select Friend'}>
			<Input
				placeholder={'Search'}
				value={search}
				onChange={setSearch}
				type={'search'}
				iconStart={<FAIcon icon={faMagnifyingGlass} colour="primary" />}
			/>

			{friends.map(({ username, image, id }) => (
				<ListRow
					key={username}
					title={`@${username}`}
					placeHolderIcon={faUser}
					image={image}
					onPress={() => addMember(id)}
				/>
			))}

			{friends.length === 0 && (
				<Content size={'md'} type={'body'} center>
					All friends are either invited or members
				</Content>
			)}
		</Dialog>
	);
}
