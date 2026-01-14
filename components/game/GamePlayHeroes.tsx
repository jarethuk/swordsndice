import {
	faChevronDown,
	faChevronUp,
	faMinus,
	faPlus,
} from '@awesome.me/kit-34e2017de2/icons/duotone/solid';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';
import { useAPIUpdateGameList } from '../../api/games/useAPIUpdateGameList';
import { MESBGProfiles } from '../../data/MESBGProfiles';
import {
	getMESBGStats,
	getRemainingMESBGStats,
	toRemainingMESBGStatsFlat,
} from '../../helpers/MESBGStatsHelper';
import { useDebounce } from '../../hooks/useDebounce';
import { MESBGArmySlot } from '../../types';
import type { ListBody, ListMember } from '../../types/api/ListBody';
import type { GameResponse } from '../../types/api/responses/GameResponse';
import type {
	MESBGProfileStats,
	RemainingMESBGProfileStats,
} from '../../types/MESBGProfileStats';
import { Content } from '../Content';
import { FAIcon } from '../FAIcon';
import HeroPoints from '../HeroPoints';

type Stats = 'will' | 'might' | 'fate' | 'wounds';

interface Props {
	game: GameResponse;
	canUpdate: boolean;
	memberId: string;
}

interface MemberWithStats extends ListMember {
	fullStats: MESBGProfileStats;
	fullRemainingStats: RemainingMESBGProfileStats;
}

interface HeroGroup {
	id: string;
	leader: MemberWithStats;
	members: MemberWithStats[];
}

interface HeroRowProps extends Props {
	groupId: string;
	member: MemberWithStats;
	setList: (list: ListBody) => void;
}

interface StatsControlProps {
	title: string;
	stat: Stats;
	value: number;
	onChange: (value: number, stat: Stats) => void;
}

const StatsControl = ({ title, value, onChange, stat }: StatsControlProps) => {
	return (
		<View className={'flex flex-row items-center gap-1'}>
			<Pressable
				className={'items-center justify-center p-4'}
				onPress={() => value > 0 && onChange(value - 1, stat)}
			>
				<FAIcon icon={faMinus} />
			</Pressable>

			<View className={'flex w-8'}>
				<Content type={'subtitle'} size={'xs'} center muted>
					{title}
				</Content>

				<Content type={'title'} size={'xs'} center>
					{value}
				</Content>
			</View>

			<Pressable
				className={'items-center justify-center p-4'}
				onPress={() => onChange(value + 1, stat)}
			>
				<FAIcon icon={faPlus} />
			</Pressable>
		</View>
	);
};

const UnitRow = ({
	member,
	canUpdate,
	game,
	memberId,
	groupId,
	setList,
}: HeroRowProps) => {
	const [open, setOpen] = useState(false);
	const [stats, setStats] = useState<RemainingMESBGProfileStats>(
		member.fullRemainingStats,
	);
	const { debouncedValue, setDebouncedValue } = useDebounce(stats, 2000);
	const [pendingUpdate, setPendingUpdate] = useState(false);

	const { mutateAsync } = useAPIUpdateGameList();

	// On server update, update local state
	useEffect(() => {
		setStats(member.fullRemainingStats);
		setDebouncedValue(member.fullRemainingStats);
	}, [member, setDebouncedValue]);

	const update = useCallback(async () => {
		if (!pendingUpdate) return;
		setPendingUpdate(false);

		const list = game.members.find(
			(member) => member.user?.id === memberId,
		)?.list;

		if (!list) return;

		const newList: ListBody = JSON.parse(JSON.stringify(list));
		const group = newList?.groups.find((group) => group.id === groupId);
		const unit =
			group?.leader.id === member.id
				? group?.leader
				: group?.members.find((x) => x.id === member.id);

		if (!unit) return;
		unit.remainingStats = toRemainingMESBGStatsFlat(debouncedValue);

		await mutateAsync({
			id: game.id,
			list: newList,
		});

		setList(newList);
	}, [
		debouncedValue,
		game.id,
		game.members,
		groupId,
		member.id,
		memberId,
		mutateAsync,
		pendingUpdate,
		setList,
	]);

	// Only update the API when the user stops typing for 1 second
	useEffect(() => {
		void update();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [debouncedValue]);

	const onChange = useCallback(
		(value: number, stat: Stats) => {
			const newStats = { ...stats };

			switch (stat) {
				case 'will':
					newStats.will = value;
					break;
				case 'might':
					newStats.might = value;
					break;
				case 'fate':
					newStats.fate = value;
					break;
				case 'wounds':
					newStats.wounds = value;
					break;
			}

			setPendingUpdate(true);
			setStats(newStats);
		},
		[stats],
	);

	return (
		<Pressable
			onPress={() => setOpen(!open)}
			className={
				'border-border-light dark:border-border-dark flex gap-2 rounded-2xl border-2 p-4'
			}
		>
			<View className={'flex shrink flex-row items-center'}>
				<Content type={'title'} size={'xs'} wrap>
					{member.name}
				</Content>

				{canUpdate && (
					<View className={'ml-auto'}>
						<FAIcon
							icon={open ? faChevronUp : faChevronDown}
						/>
					</View>
				)}
			</View>

			{open ? (
				<>
					<View className={'flex flex-row items-center justify-evenly gap-2'}>
						<StatsControl
							title={'M'}
							value={stats.might}
							onChange={onChange}
							stat={'might'}
						/>
						<StatsControl
							title={'W'}
							value={stats.will}
							onChange={onChange}
							stat={'will'}
						/>
					</View>

					<View className={'flex flex-row items-center justify-evenly gap-2'}>
						<StatsControl
							title={'F'}
							value={stats.fate}
							onChange={onChange}
							stat={'fate'}
						/>
						<StatsControl
							title={'Wo'}
							value={stats.wounds}
							onChange={onChange}
							stat={'wounds'}
						/>
					</View>
				</>
			) : (
				<HeroPoints
					profile={{
						name: member.name,
						slot: MESBGArmySlot.Warrior,
						fullStats: member.fullStats,
						remainingStats: member.fullRemainingStats,
					}}
					variant={'accent'}
				/>
			)}
		</Pressable>
	);
};

export const GamePlayHeroes = (props: Props) => {
	const { game, memberId } = props;
	const [list, setList] = useState<ListBody | undefined | null>();

	useEffect(() => {
		setList(game.members.find((member) => member.user?.id === memberId)?.list);
	}, [game, memberId]);

	const groups: HeroGroup[] = useMemo(() => {
		if (!list) return [];

		const groups: HeroGroup[] = [];

		for (const group of list.groups) {
			const leaderProfile = MESBGProfiles.find(
				(x) => x.name === group.leader.name,
			);

			if (!leaderProfile) continue;

			const leaderStats = getMESBGStats(leaderProfile);

			const heroGroup: HeroGroup = {
				id: group.id,
				leader: {
					...group.leader,
					fullStats: leaderStats,
					fullRemainingStats: getRemainingMESBGStats(leaderStats, group.leader),
				},
				members: [],
			};

			for (const unit of group.members) {
				if (unit.slot === MESBGArmySlot.Warrior) continue;

				const profile = MESBGProfiles.find((x) => x.name === unit.name);

				if (!profile) {
					continue;
				}

				const stats = getMESBGStats(profile);

				if (!stats.will && !stats.might && !stats.fate) {
					continue;
				}

				heroGroup.members.push({
					...unit,
					fullStats: stats,
					fullRemainingStats: getRemainingMESBGStats(stats, unit),
				});
			}

			groups.push(heroGroup);
		}

		return groups;
	}, [list]);

	return (
		<View className={'flex gap-6'}>
			{groups.map((group, index) => (
				<View key={index.toString()} className={'flex gap-4'}>
					<Content size={'xs'} type={'title'}>
						Warband {index + 1}
					</Content>

					<UnitRow
						member={group.leader}
						{...props}
						groupId={group.id}
						setList={setList}
					/>

					{group.members.map((member) => (
						<UnitRow
							member={member}
							key={member.id}
							{...props}
							groupId={group.id}
							setList={setList}
						/>
					))}
				</View>
			))}
		</View>
	);
};
