import {
	faChevronLeft,
	faCopy,
	faEdit,
	faExclamationTriangle,
} from '@awesome.me/kit-34e2017de2/icons/duotone/solid';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo } from 'react';
import { Animated, Pressable, View } from 'react-native';
import { useAPIList } from '../../api/list/useAPIList';
import { Content } from '../../components';
import { Button } from '../../components/Button';
import { Container } from '../../components/Container';
import Divider from '../../components/Divider';
import { FAIcon } from '../../components/FAIcon';
import ListWarband from '../../components/ListWarband';
import { LoadingScreen } from '../../components/LoadingScreen';
import { MESBGArmies } from '../../data/MESBGArmies';
import { getPointsTotal } from '../../helpers/MESBGStatsHelper';
import { useList, useListActions } from '../../states/useListStore';

import ScrollView = Animated.ScrollView;

export default function ListPage() {
	const { id } = useLocalSearchParams();
	const list = useList();
	const { setList, updateList } = useListActions();
	const canEdit = true;
	const { data: apiList, refetch: refreshList } = useAPIList(id as string);

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
					<Pressable>
						<FAIcon icon={faCopy} size={20} colour="muted" />
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
						key={index.toString()}
						canEdit={canEdit}
						index={index}
					/>
				))}

				{list.groups.length > 0 && <Divider />}

				{canEdit && (
					<Button
						content={'Add Warband'}
						onPress={() => router.navigate('/modals/list-add-warband')}
					/>
				)}
			</ScrollView>
		</Container>
	);
}
