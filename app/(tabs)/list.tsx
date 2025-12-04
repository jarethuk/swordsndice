import {faChevronLeft, faCopy, faEdit, faExclamationTriangle,} from '@awesome.me/kit-34e2017de2/icons/duotone/solid';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {router, useLocalSearchParams} from 'expo-router';
import {useCallback, useEffect, useMemo, useState} from 'react';
import {Animated, Pressable, View} from 'react-native';
import {Content} from '../../components';
import {Button} from '../../components/Button';
import ListWarband from '../../components/ListWarband';
import {LoadingScreen} from '../../components/LoadingScreen';
import AddWarbandPopup from '../../components/popups/AddWarbandPopup';
import EditListPopup from '../../components/popups/EditListPopup';
import {MESBGArmies} from '../../data/MESBGArmies';
import {getDBList} from '../../db/DBLists';
import {getPointsTotal} from '../../helpers/MESBGStatsHelper';
import {useColours} from '../../hooks/useColours';
import type {List} from '../../types/List';
import ScrollView = Animated.ScrollView;

export default function ListPage() {
	const colours = useColours();
	const { id } = useLocalSearchParams();
	const [list, setList] = useState<List | undefined | null>();
	const canEdit = true;

	const [isEditing, setIsEditing] = useState(false);
	const [isAddingWarband, setIsAddingWarband] = useState(false);

	const refreshList = useCallback(async () => {
		getDBList(id as string).then((record) => {
			if (!record) {
				setList(null);
			} else {
				setList({
					...record,
					groups: JSON.parse(record.groups),
				} as List);
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

	//  TODO: Tap add warband and choose a leader
	// Returns back to list page
	// Tap to add units to warband
	// Show points total for warband, unit count of max

	return (
		<>
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
						<Pressable onPress={() => setIsEditing(true)}>
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
					<Content size={'xs'} type={'title'}>
						Warbands
					</Content>

					{list.groups.map((group, index) => (
						<ListWarband
							group={group}
							list={list}
							army={army}
							key={index.toString()}
							onDelete={refreshList}
							canEdit={canEdit}
							refresh={refreshList}
						/>
					))}

					{canEdit && (
						<Button
							content={'Add Warband'}
							onPress={() => setIsAddingWarband(true)}
						/>
					)}
				</ScrollView>
			</View>

			{isEditing && (
				<EditListPopup
					onDismiss={() => {
						setIsEditing(false);
						void refreshList();
					}}
					list={list as List}
				/>
			)}

			{isAddingWarband && (
				<AddWarbandPopup
					onDismiss={() => {
						setIsAddingWarband(false);
					}}
					list={list as List}
					onSelect={() => {
						setIsAddingWarband(false);
						void refreshList();
					}}
				/>
			)}
		</>
	);
}
