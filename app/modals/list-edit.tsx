import {router} from 'expo-router';
import {useCallback, useState} from 'react';
import {View} from 'react-native';
import {Content} from '../../components';
import {Button} from '../../components/Button';
import {Input} from '../../components/Input';
import {deleteDBList} from '../../db/DBLists';
import {useList, useListActions} from '../../states/useListStore';

export default function EditListPopup() {
	const list = useList();
	const { updateList } = useListActions();

	const [name, setName] = useState(list?.name ?? '');
	const [points, setPoints] = useState(list?.points.toString() ?? '');
	const [isSaving, setIsSaving] = useState(false);

	const isValid = name && points && Number(points) > 0;

	const saveList = useCallback(async () => {
		if (isSaving || !list) return;

		setIsSaving(true);

		await updateList({
			name,
			points: Number(points),
		});

		setIsSaving(false);
		router.dismiss();
	}, [list, name, points, isSaving]);

	const deleteList = useCallback(async () => {
		if (!list) return;

		await deleteDBList(list.id);
		router.navigate('/(tabs)/lists');
	}, [list]);

	return (
		<View className={'flex flex-col gap-6 p-6 h-full'}>
			<Content size={'sm'} type={'title'} center>
				Edit List
			</Content>

			<View className={'flex flex-col gap-6 grow'}>
				<Input
					placeholder={'Name'}
					value={name}
					onChange={setName}
					type={'text'}
					label={'Name'}
				/>

				<Input
					placeholder={'Points'}
					value={points}
					onChange={setPoints}
					type={'numeric'}
					label={'Points'}
				/>

				<Button content={'Delete'} variant={'negative'} onPress={deleteList} />
			</View>

			<Button
				content={'Save'}
				disabled={!isValid}
				loading={isSaving}
				onPress={saveList}
			/>
		</View>
	);
}
