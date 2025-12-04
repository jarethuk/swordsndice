import {router} from 'expo-router';
import {useCallback, useMemo, useState} from 'react';
import {Animated} from 'react-native';
import {Content} from '../../components';
import {Button} from '../../components/Button';
import {Input} from '../../components/Input';
import {NextWindowButton} from '../../components/NextWindowButton';
import SelectArmyPopup from '../../components/popups/SelectArmyPopup';
import SelectGamePopup from '../../components/popups/SelectGamePopup';
import {addDBList} from '../../db/DBLists';
import {getRandomId} from '../../helpers/RandomHelper';
import type {Games} from '../../types';
import type {List} from '../../types/List';
import ScrollView = Animated.ScrollView;

export default function CreateList() {
	const [name, setName] = useState('');
	const [points, setPoints] = useState('');
	const [game, setGame] = useState<Games | undefined>();
	const [army, setArmy] = useState<string | undefined>();

	const [selectingGame, setSelectingGame] = useState(false);
	const [selectingArmy, setSelectingArmy] = useState(false);
	const [isCreating, setIsCreating] = useState(false);

	const isValid = useMemo(() => {
		const intPoints = parseInt(points, 10);

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
		router.navigate(`(tabs)/list?id=${list.id}`);
	}, [name, points, game, army, isCreating]);

	return (
		<>
			<ScrollView contentContainerClassName={'flex gap-6'}>
				<Content size={'sm'} type={'title'} center>
					Create List
				</Content>

				<Input
					placeholder={'Name'}
					value={name}
					onChange={setName}
					type={'text'}
				/>

				<NextWindowButton
					onPress={() => setSelectingGame(true)}
					label={game ?? 'Select Game'}
				/>

				<NextWindowButton
					onPress={() => setSelectingArmy(true)}
					label={army ?? 'Select Army'}
					disabled={!game}
				/>

				<Input
					placeholder={'Points'}
					value={points}
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

			{selectingGame && (
				<SelectGamePopup
					onDismiss={() => setSelectingGame(false)}
					onSelect={(value) => {
						setSelectingGame(false);
						setGame(value);
					}}
				/>
			)}

			{selectingArmy && (
				<SelectArmyPopup
					game={game as Games}
					onDismiss={() => setSelectingGame(false)}
					onSelect={(value) => {
						setSelectingArmy(false);
						setArmy(value);
					}}
				/>
			)}
		</>
	);
}
