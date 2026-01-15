import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import { View } from 'react-native';
import { useAPIDeleteList } from '../../api/list/useAPIDeleteList';
import { Content } from '../../components';
import { Button } from '../../components/Button';
import { Dialog } from '../../components/Dialog';
import { Input } from '../../components/Input';
import { useList, useListActions } from '../../states/useListStore';

export default function EditListPopup() {
	const list = useList();
	const { updateList } = useListActions();
	const { mutateAsync: apiDeleteList } = useAPIDeleteList();
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
	}, [isSaving, list, updateList, name, points]);

	const deleteList = useCallback(async () => {
		if (!list?.id) return;

		await apiDeleteList(list.id);
		router.navigate('/(tabs)/lists');
	}, [apiDeleteList, list?.id]);

	return (
		<Dialog title={'Edit List'}>
			<Content size={'sm'} type={'title'} center>
				Edit List
			</Content>

			<View className={'flex grow flex-col gap-6'}>
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
		</Dialog>
	);
}
