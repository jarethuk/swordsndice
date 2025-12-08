import {router} from 'expo-router';
import {useCallback, useMemo, useState} from 'react';
import {Animated} from 'react-native';
import {Content} from '../../components';
import {Button} from '../../components/Button';
import {Input} from '../../components/Input';
import {NextWindowButton} from '../../components/NextWindowButton';
import {addDBList} from '../../db/DBLists';
import {getRandomId} from '../../helpers/RandomHelper';
import {
    useNewListActions,
    useNewListArmy,
    useNewListGame,
    useNewListName,
    useNewListPoints,
} from '../../states/useNewListStore';
import type {List} from '../../types/List';

import {SelectGameDialogMode} from '../../types';
import ScrollView = Animated.ScrollView;

export default function CreateList() {
	const name = useNewListName();
	const army = useNewListArmy();
	const game = useNewListGame();
	const points = useNewListPoints();
	const { setName, setPoints, reset } = useNewListActions();

	const [isCreating, setIsCreating] = useState(false);

	const isValid = useMemo(() => {
		const intPoints = parseInt(points ?? '', 10);

		return game && army && name && points && intPoints > 0;
	}, [game, army, name, points]);

	const createList = useCallback(async () => {
		if (!game || !army || !name || !points || isCreating) return;

		setIsCreating(true);

		const list: List = {
			id: getRandomId(),
			name,
			army,
			game,
			points: Number(points),
			createdAt: new Date(),
			groups: [],
		};

		await addDBList(list);
		setIsCreating(false);
		reset();

		router.navigate({
			pathname: '/(tabs)/list',
			params: { id: list.id },
		});
	}, [name, points, game, army, isCreating]);

	return (
		<ScrollView contentContainerClassName={'flex gap-6'}>
			<Content size={'sm'} type={'title'} center>
				Create List
			</Content>

			<Input
				placeholder={'Name'}
				value={name ?? ''}
				onChange={setName}
				type={'text'}
			/>

			<NextWindowButton
				onPress={() =>
					router.navigate({
						pathname: '/modals/select-game',
						params: { mode: SelectGameDialogMode.CreateList },
					})
				}
				label={game ?? 'Select Game'}
			/>

			<NextWindowButton
				onPress={() => router.navigate('/modals/select-army')}
				label={army ?? 'Select Army'}
				disabled={!game}
			/>

			<Input
				placeholder={'Points'}
				value={points ?? ''}
				onChange={setPoints}
				type={'numeric'}
			/>

			<Button
				content={'Create List'}
				disabled={!isValid}
				loading={isCreating}
				onPress={createList}
			/>
		</ScrollView>
	);
}
