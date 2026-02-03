import {
	faChevronLeft,
	faCopy,
	faEdit,
	faExclamationTriangle,
} from '@awesome.me/kit-6b5fd61d92/icons/duotone/solid';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useMemo } from 'react';
import { Animated, Pressable, View } from 'react-native';
import { useAPICreateList } from '../../api/list/useAPICreateList';
import { useAPIList } from '../../api/list/useAPIList';
import { Button } from '../../components/common/Button';
import { Container } from '../../components/common/Container';
import { Content } from '../../components/common/Content';
import Divider from '../../components/common/Divider';
import { FAIcon } from '../../components/common/FAIcon';
import { Loading } from '../../components/common/Loading';
import { LoadingScreen } from '../../components/common/LoadingScreen';
import ListWarband from '../../components/list/ListWarband';
import { MESBGArmies } from '../../data/MESBGArmies';
import { getPointsTotal } from '../../helpers/MESBGStatsHelper';
import { useList, useListActions } from '../../states/useListStore';
import { useUser } from '../../states/useUserStore';

import ScrollView = Animated.ScrollView;

export default function ListPage() {
	const { id } = useLocalSearchParams();
	const list = useList();
	const { setList, updateList } = useListActions();
	const user = useUser();
	const canEdit = user?.id === list?.userId;

	const { data: apiList, refetch: refreshList } = useAPIList(id as string);
	const { mutateAsync: apiCreateList, isPending: copyListPending } =
		useAPICreateList();

	useEffect(() => {
		if (apiList) {
			setList(apiList);
		}
	}, [apiList, setList]);

	const army = useMemo(() => {
		if (!list?.army) return;

		return MESBGArmies.find((x) => x.name === list.army);
	}, [list?.army]);

	const pointsTotal = useMemo(() => {
		if (!list) return;

		return getPointsTotal(list);
	}, [list]);

	useEffect(() => {
		if (!id || list?.id === id) return;

		void refreshList();
	}, [id, list, refreshList]);

	useEffect(() => {
		if (list?.actualPoints !== pointsTotal) {
			void updateList({ actualPoints: pointsTotal });
		}
	}, [list, pointsTotal, updateList]);

	const copyList = useCallback(async () => {
		if (!list) return;

		const { id } = await apiCreateList({
			...list,
			name: `${list.name} (copy)`,
			id: undefined,
		});

		router.push({
			pathname: '/(tabs)/list',
			params: { id },
		});
	}, [apiCreateList, list]);

	if (list === null) {
		return (
			<View
				className={'m-auto flex w-1/2 flex-1 items-center justify-center gap-4'}
			>
				<FAIcon icon={faExclamationTriangle} size={26} colour="warning" />

				<Content size={'sm'} type={'title'} center>
					List not found
				</Content>

				<Content size={'sm'} type={'subtitle'} center>
					We couldn&apos;t find this list. It may have been deleted.
				</Content>
			</View>
		);
	}

	if (!list || !army) {
		return <LoadingScreen message={'Loading list...'} />;
	}

	return (
		<Container>
			<View className={'flex flex-row items-center gap-4'}>
				<Pressable onPress={() => router.back()}>
					<FAIcon icon={faChevronLeft} size={20} colour="muted" />
				</Pressable>

				<View className={'grow'}>
					<Content size={'md'} type={'title'} center>
						{list.name}
					</Content>

					<Content size={'md'} type={'subtitle'} center muted>
						{list.army} - {pointsTotal}/{list.points}pts
					</Content>
				</View>

				{canEdit ? (
					<Pressable onPress={() => router.navigate('/modals/list-edit')}>
						<FAIcon icon={faEdit} size={20} colour="muted" />
					</Pressable>
				) : (
					<Pressable onPress={copyList}>
						{copyListPending ? (
							<Loading size={20} />
						) : (
							<FAIcon icon={faCopy} size={20} colour="muted" />
						)}
					</Pressable>
				)}
			</View>

			<ScrollView
				contentContainerClassName={'flex flex-col gap-6 pb-12'}
				showsVerticalScrollIndicator={false}
			>
				{list.groups.map((group, index) => (
					<ListWarband
						group={group}
						list={list}
						army={army}
						key={list.hash + group.id}
						canEdit={canEdit}
						index={index}
					/>
				))}

				{canEdit && (
					<>
						{list.groups.length > 0 && <Divider />}

						<Button
							content={'Add Warband'}
							onPress={() => router.navigate('/modals/list-add-warband')}
						/>
					</>
				)}
			</ScrollView>
		</Container>
	);
}
