import { faUser } from '@awesome.me/kit-6b5fd61d92/icons/duotone/solid';
import { useMemo } from 'react';
import { View } from 'react-native';
import { MESBGProfiles } from '../../data/MESBGProfiles';
import {
	getMESBGStats,
	getRemainingMESBGStats,
} from '../../helpers/MESBGStatsHelper';
import type { ListMember } from '../../types/api/ListBody';
import type { GameResponse } from '../../types/api/responses/GameResponse';
import type { PublicUser } from '../../types/api/responses/PublicUser';
import { Content } from '../common/Content';
import ListRow from '../common/ListRow';

interface Props {
	game: GameResponse;
}

interface MemberSummary {
	user: PublicUser;
	might: number;
	remainingMight: number;
	unitsStart: number;
	unitsLost: number;
}

const getUnitStats = (member: ListMember) => {
	const profile = MESBGProfiles.find((x) => x.name === member.name);

	if (!profile) return;

	const stats = getMESBGStats(profile);
	const remainingStats = getRemainingMESBGStats(stats, member);

	return {
		stats,
		remainingStats,
	};
};

const getStatNumber = (value: string | number): number => {
	const number = Number(value);

	if (Number.isNaN(number)) return 0;

	return number;
};

export const GamePlayStats = ({ game }: Props) => {
	const members = useMemo(() => {
		const stats: MemberSummary[] = [];

		for (const member of game.members) {
			if (!member.list) {
				console.log(member);
				continue;
			}

			let might = 0;
			let remainingMight = 0;

			for (const group of member.list.groups) {
				const leaderStats = getUnitStats(group.leader);

				if (leaderStats) {
					might += getStatNumber(leaderStats.stats.might);
					remainingMight += getStatNumber(leaderStats.remainingStats.might);
				}

				for (const unit of group.members) {
					const unitStats = getUnitStats(unit);

					if (unitStats) {
						might += getStatNumber(unitStats.stats.might);
						remainingMight += getStatNumber(unitStats.remainingStats.might);
					}
				}
			}

			stats.push({
				unitsLost: member.modelCount - member.modelCountRemaining,
				might,
				remainingMight,
				user: member.user as PublicUser,
				unitsStart: member.modelCount,
			});
		}

		return stats;
	}, [game]);

	console.log(members);

	return (
		<View className={'flex gap-12'}>
			<View className={'flex gap-6'}>
				<Content size={'xs'} type={'title'}>
					Remaining Might
				</Content>

				<View className={'flex gap-4'}>
					{members
						.sort((a, b) => b.remainingMight - a.remainingMight)
						.map(({ user, might, remainingMight }) => (
							<ListRow
								key={user.id}
								title={user.username}
								placeHolderIcon={faUser}
								image={user.image}
								right={`${remainingMight} / ${might}`}
							/>
						))}
				</View>
			</View>

			<View className={'flex gap-6'}>
				<Content size={'xs'} type={'title'}>
					Units Lost
				</Content>

				<View className={'flex gap-4'}>
					{members.map(({ user, unitsStart, unitsLost }) => (
						<ListRow
							key={user.id}
							title={user.username}
							placeHolderIcon={faUser}
							image={user.image}
							right={`${unitsLost} / ${unitsStart}`}
						/>
					))}
				</View>
			</View>
		</View>
	);
};
