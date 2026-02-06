import {
	faMinus,
	faPlus,
	faUser,
} from '@awesome.me/kit-6b5fd61d92/icons/duotone/solid';
import { useCallback, useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';
import { useAPIUpdateGameMember } from '../../../api/games/useAPIUpdateGameMember';
import { useDebounce } from '../../../hooks/useDebounce';
import type { GameResponseMember } from '../../../types/api/responses/GameResponse';
import type { UserResponse } from '../../../types/api/responses/UserResponse';
import { Content } from '../../common/Content';
import { FAIcon } from '../../common/FAIcon';
import { ListImage } from '../../common/ListImage';

interface Props {
	gameId: string;
	member: GameResponseMember;
	user: UserResponse;
	refresh?: () => void;
	canEdit?: boolean;
}

export const GamePlayPoints = ({
	member,
	user,
	gameId,
	refresh,
	canEdit,
}: Props) => {
	const [points, setPoints] = useState(member.points);
	const { debouncedValue, setDebouncedValue } = useDebounce(points, 2000);
	const [pendingUpdate, setPendingUpdate] = useState(false);

	const { mutateAsync } = useAPIUpdateGameMember(gameId);

	// On server update, update local state
	useEffect(() => {
		setPoints(member.points);
		setDebouncedValue(member.points);
	}, [member, setDebouncedValue]);

	const update = useCallback(async () => {
		if (!member.user || !pendingUpdate) return;
		setPendingUpdate(false);

		await mutateAsync({
			memberId: member.user.id,
			data: {
				points: debouncedValue,
			},
		});

		refresh?.();
	}, [debouncedValue, member.user, mutateAsync, pendingUpdate, refresh]);

	// Only update the API when the user stops typing for 1 second
	useEffect(() => {
		void update();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [debouncedValue]);

	const onPointsChange = (newPoints: number) => {
		setPoints(newPoints);
		setPendingUpdate(true);
	};

	return (
		<View className={'flex w-full flex-row items-center gap-4'}>
			<ListImage image={member.user?.image} placeHolderIcon={faUser} />

			<View className={'flex shrink'}>
				<Content type={'title'} size={'xs'} wrap>
					{member.user?.username} {member.user?.id === user.id && '(You)'}
				</Content>
			</View>

			<View className={'ml-auto flex flex-row items-center gap-2'}>
				{canEdit && (
					<Pressable
						className={'items-center justify-center p-4'}
						onPress={() => onPointsChange(points - 1)}
					>
						<FAIcon icon={faMinus} />
					</Pressable>
				)}

				<View className={'w-6'}>
					<Content type={'title'} size={'xs'} center>
						{points}
					</Content>
				</View>

				{canEdit && (
					<Pressable
						className={'items-center justify-center p-4'}
						onPress={() => onPointsChange(points + 1)}
					>
						<FAIcon icon={faPlus} />
					</Pressable>
				)}
			</View>
		</View>
	);
};
