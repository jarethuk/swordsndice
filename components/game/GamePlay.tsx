import {
	faChevronLeft,
	faRefresh,
	faUser,
} from '@awesome.me/kit-6b5fd61d92/icons/duotone/solid';
import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';
import { useUser } from '../../states/useUserStore';
import type { GameResponse } from '../../types/api/responses/GameResponse';
import { Button } from '../common/Button';
import { Content } from '../common/Content';
import { DropDown, type DropDownOption } from '../common/DropDown';
import { FAIcon } from '../common/FAIcon';
import ListRow from '../common/ListRow';
import { LoadingScreen } from '../common/LoadingScreen';
import { TabInput } from '../common/TabInput';
import { GamePlayHeroes } from './GamePlayHeroes';
import { GamePlayModels } from './GamePlayModels';
import { GamePlayPoints } from './GamePlayPoints';
import { GamePlayStats } from './GamePlayStats';

interface Props {
	id: string;
	game: GameResponse;
	refresh: () => void;
}

const Tabs = {
	MyList: 'my-list',
	OtherLists: 'other-lists',
	Stats: 'stats',
};

export function GamePlay({ game, id, refresh }: Props) {
	const user = useUser();
	const [tab, setTab] = useState<string>('my-list');
	const [otherListMemberId, setOtherListMemberId] = useState<
		string | undefined
	>(undefined);

	const isMember = useMemo(() => {
		if (!user) return false;

		return !!game.members.find((x) => x.user?.id === user?.id);
	}, [game.members, user]);

	const otherMembersOptions: DropDownOption[] = useMemo(() => {
		return game.members
			.filter((member) => member.user?.id !== user?.id)
			.map((member) => ({
				title: `@${member.user?.username}`,
				value: member.user?.id ?? '',
			}));
	}, [game.members, user?.id]);

	useEffect(() => {
		if (!otherListMemberId && otherMembersOptions.length > 0) {
			setOtherListMemberId(otherMembersOptions[0].value);
		}
	}, [otherListMemberId, otherMembersOptions]);

	const winners = useMemo(() => {
		if (!game.members.length || !game.isComplete) return [];

		const maxPoints = Math.max(...game.members.map((m) => m.points ?? 0));

		return game.members.filter((member) => (member.points ?? 0) === maxPoints);
	}, [game]);

	if (!user) {
		return <LoadingScreen message={'Loading game...'} />;
	}

	return (
		<View className={'flex gap-12'}>
			<View className={'flex gap-2'}>
				<View className={'flex flex-row items-center gap-4'}>
					<Pressable onPress={() => router.back()} className={'w-4'}>
						<FAIcon icon={faChevronLeft} />
					</Pressable>

					<View className={'grow'}>
						<Content size={'sm'} type={'title'} center>
							{game.game} ({game.points}pts)
						</Content>
					</View>

					<Pressable onPress={refresh} className={'w-4'}>
						<FAIcon icon={faRefresh} />
					</Pressable>
				</View>

				<Content size={'md'} type={'subtitle'} center muted>
					{game.members
						.map((member) => member.list?.army)
						.filter((x) => !!x)
						.join(' vs ')}
				</Content>
			</View>

			{game.isComplete && (
				<View className={'flex gap-6'}>
					<Content size={'xs'} type={'title'}>
						{winners.length > 1 ? 'Winners' : 'Winner'}
					</Content>

					{winners.map((winner) => (
						<ListRow
							key={winner.user?.id}
							title={winner.user?.username ?? ''}
							subtitle={`${winner.points} victory points`}
							placeHolderIcon={faUser}
							image={winner.user?.image}
						/>
					))}
				</View>
			)}

			<View className={'flex gap-6'}>
				<Content size={'xs'} type={'title'}>
					Victory Points
				</Content>

				{game.members
					.sort((a, b) =>
						(a.user?.username ?? '').localeCompare(b.user?.username ?? ''),
					)
					.map((member) => (
						<GamePlayPoints
							key={member.user?.id}
							member={member}
							user={user}
							gameId={id}
							canEdit={isMember}
						/>
					))}
			</View>

			<View className={'flex gap-6'}>
				<Content size={'xs'} type={'title'}>
					Models Remaining
				</Content>

				{game.members
					.sort((a, b) =>
						(a.user?.username ?? '').localeCompare(b.user?.username ?? ''),
					)
					.map((member) => (
						<GamePlayModels
							key={member.user?.id}
							member={member}
							user={user}
							gameId={id}
							canEdit={isMember}
						/>
					))}
			</View>

			{!game.isComplete && isMember && (
				<Button
					content={'Finish Game'}
					variant={'outline'}
					onPress={() =>
						router.navigate({
							pathname: '/modals/game-finish',
							params: {
								id,
							},
						})
					}
				/>
			)}

			<View className={'flex gap-6'}>
				{isMember && otherMembersOptions.length > 0 && (
					<TabInput
						selected={tab}
						tabs={[
							{
								title: 'My List',
								value: Tabs.MyList,
							},
							{
								title: 'Other Lists',
								value: Tabs.OtherLists,
							},
							{
								title: 'Stats',
								value: Tabs.Stats,
							},
						]}
						onChange={setTab}
					/>
				)}

				{tab === Tabs.MyList && (
					<GamePlayHeroes
						game={game}
						memberId={user.id}
						canUpdate={!game.isComplete && isMember}
					/>
				)}

				{(tab === Tabs.OtherLists || !isMember) && (
					<View className={'flex gap-4'}>
						<View className={'ml-auto'}>
							<DropDown
								selected={otherListMemberId}
								options={otherMembersOptions}
								onChange={(value) => setOtherListMemberId(value)}
							/>
						</View>

						{otherListMemberId && (
							<GamePlayHeroes
								game={game}
								memberId={otherListMemberId}
								canUpdate={false}
							/>
						)}
					</View>
				)}

				{tab === Tabs.Stats && <GamePlayStats game={game} />}
			</View>
		</View>
	);
}
