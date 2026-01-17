import {
	faMinus,
	faPlus,
	faUser,
} from '@awesome.me/kit-34e2017de2/icons/duotone/solid';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';
import { useAPIUpdateGameMember } from '../../api/games/useAPIUpdateGameMember';
import { useDebounce } from '../../hooks/useDebounce';
import type { GameResponseMember } from '../../types/api/responses/GameResponse';
import type { UserResponse } from '../../types/api/responses/UserResponse';
import { Content } from '../Content';
import { FAIcon } from '../FAIcon';
import { ListImage } from '../ListImage';

interface Props {
	gameId: string;
	member: GameResponseMember;
	user: UserResponse;
	refresh?: () => void;
	canEdit?: boolean;
}

export const GamePlayModels = ({
	member,
	user,
	gameId,
	refresh,
	canEdit,
}: Props) => {
	const [modelsRemaining, setModelsRemaining] = useState(
		member.modelCountRemaining,
	);
	const { debouncedValue, setDebouncedValue } = useDebounce(
		modelsRemaining,
		2000,
	);
	const [pendingUpdate, setPendingUpdate] = useState(false);

	const { mutateAsync } = useAPIUpdateGameMember(gameId);

	// On server update, update local state
	useEffect(() => {
		setModelsRemaining(member.modelCountRemaining);
		setDebouncedValue(member.modelCountRemaining);
	}, [member, setDebouncedValue]);

	const update = useCallback(async () => {
		if (!member.user || !pendingUpdate) return;
		setPendingUpdate(false);

		await mutateAsync({
			memberId: member.user.id,
			data: {
				modelCountRemaining: debouncedValue,
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
		if (newPoints < 0) return;

		setModelsRemaining(newPoints);
		setPendingUpdate(true);
	};

	const brokenAt = useMemo(() => {
		return Math.ceil(member.modelCount / 2);
	}, [member.modelCount]);

	const quarteredAt = useMemo(() => {
		return Math.floor(member.modelCount / 4);
	}, [member.modelCount]);

	const numberColour = useMemo(() => {
		if (modelsRemaining <= quarteredAt) {
			return 'negative';
		}

		if (modelsRemaining <= brokenAt) {
			return 'warning';
		}
	}, [brokenAt, modelsRemaining, quarteredAt]);

	return (
		<View className={'flex w-full flex-row items-center gap-4'}>
			<ListImage image={member.user?.image} placeHolderIcon={faUser} />

			<View className={'flex'}>
				<View className={'flex shrink'}>
					<Content type={'title'} size={'xs'} wrap>
						{member.user?.username} {member.user?.id === user.id && '(You)'}
					</Content>
				</View>

				<View className={'flex flex-row items-center gap-4'}>
					<View className={'flex flex-row gap-2'}>
						<Content size={'md'} type={'subtitle'} variant={'warning'} muted>
							Break
						</Content>

						<Content size={'md'} type={'subtitle'} variant={'warning'}>
							{brokenAt}
						</Content>
					</View>

					<View className={'flex flex-row gap-1'}>
						<Content size={'md'} type={'subtitle'} variant={'negative'} muted>
							Quartered
						</Content>

						<Content size={'md'} type={'subtitle'} variant={'negative'}>
							{quarteredAt}
						</Content>
					</View>
				</View>
			</View>

			<View className={'ml-auto flex flex-row items-center gap-2'}>
				{canEdit && (
					<Pressable
						className={'items-center justify-center p-4'}
						onPress={() => onPointsChange(modelsRemaining - 1)}
					>
						<FAIcon icon={faMinus} />
					</Pressable>
				)}

				<View className={'w-6'}>
					<Content type={'title'} size={'xs'} center variant={numberColour}>
						{modelsRemaining}
					</Content>
				</View>

				{canEdit && (
					<Pressable
						className={'items-center justify-center p-4'}
						onPress={() => onPointsChange(modelsRemaining + 1)}
					>
						<FAIcon icon={faPlus} />
					</Pressable>
				)}
			</View>
		</View>
	);
};
