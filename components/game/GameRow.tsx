import {
	faChevronRight,
	faSwords,
} from '@awesome.me/kit-6b5fd61d92/icons/duotone/solid';
import { router } from 'expo-router';
import { Pressable, View } from 'react-native';
import type { GameListResponse } from '../../types/api/responses/GameListResponse';
import { Content } from '../common/Content';
import { FAIcon } from '../common/FAIcon';
import { ListImage } from '../common/ListImage';

interface Props {
	item: GameListResponse;
}

const getGameTitle = (game: GameListResponse): string => {
	if (game.members && game.members.length > 0) {
		if (game.members.every((x) => x.army)) {
			return game.members.map((x) => x.army).join(' vs ');
		}

		return game.members.map((x) => `@${x.username}`).join(' vs ');
	}

	return `${game.game} (${game.points} points)`;
};

export default function GameRow({ item }: Props) {
	return (
		<Pressable
			key={item.id}
			className={
				'border-border-light dark:border-border-dark flex w-full flex-row items-center gap-4 rounded-2xl border-2 p-4'
			}
			onPress={() =>
				router.push({
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

			<FAIcon icon={faChevronRight} />
		</Pressable>
	);
}
