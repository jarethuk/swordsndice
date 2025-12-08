import {faChevronLeft, faCopy, faEdit, faExclamationTriangle,} from '@awesome.me/kit-34e2017de2/icons/duotone/solid';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {router, useLocalSearchParams} from 'expo-router';
import {useCallback, useEffect, useMemo} from 'react';
import {Animated, Pressable, View} from 'react-native';
import {Content} from '../../components';
import {Button} from '../../components/Button';
import Divider from '../../components/Divider';
import ListWarband from '../../components/ListWarband';
import {LoadingScreen} from '../../components/LoadingScreen';
import {MESBGArmies} from '../../data/MESBGArmies';
import {getDBList} from '../../db/DBLists';
import {getPointsTotal} from '../../helpers/MESBGStatsHelper';
import {useColours} from '../../hooks/useColours';
import {useList, useListActions} from '../../states/useListStore';
import ScrollView = Animated.ScrollView;

export default function ListPage() {
	const colours = useColours();
	const { id } = useLocalSearchParams();
	const list = useList();
	const { setList, updateList } = useListActions();
	const canEdit = true;

	const refreshList = useCallback(async () => {
		getDBList(id as string).then((record) => {
			if (!record) {
				setList(undefined);
			} else {
				setList(record);
			}
		});
	}, [id]);

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
	}, [id, list]);

	useEffect(() => {
		if (list?.actualPoints !== pointsTotal) {
			void updateList({ actualPoints: pointsTotal });
		}
	}, [list, pointsTotal]);

	if (list === null) {
		return (
			<View
				className={'flex flex-1 items-center justify-center gap-4 w-1/2 m-auto'}
			>
				<FontAwesomeIcon
					icon={faExclamationTriangle}
					size={26}
					color={colours.warning}
				/>

				<Content size={'sm'} type={'title'} center>
					List not found
				</Content>

				<Content size={'sm'} type={'subtitle'} center>
					We couldn't find this list. It may have been deleted.
				</Content>
			</View>
		);
	}

	if (!list || !army) {
		return <LoadingScreen />;
	}

	return (
		<View className={'flex flex-col gap-6 h-full'}>
			<View className={'flex flex-row gap-4 items-center'}>
				<Pressable onPress={() => router.back()}>
					<FontAwesomeIcon
						icon={faChevronLeft}
						size={20}
						color={colours.muted}
					/>
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
						<FontAwesomeIcon icon={faEdit} size={20} color={colours.muted} />
					</Pressable>
				) : (
					<Pressable>
						<FontAwesomeIcon icon={faCopy} size={20} color={colours.muted} />
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
						onDelete={refreshList}
						canEdit={canEdit}
						refresh={refreshList}
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
		</View>
	);
}
