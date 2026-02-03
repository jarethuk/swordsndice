import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import { View } from 'react-native';
import { useAPICreateList } from '../../api/list/useAPICreateList';
import { useAPIDeleteList } from '../../api/list/useAPIDeleteList';
import { Button } from '../../components/common/Button';
import { Content } from '../../components/common/Content';
import { Dialog } from '../../components/common/Dialog';
import { Input } from '../../components/common/Input';
import { useList, useListActions } from '../../states/useListStore';

export default function EditListPopup() {
	const list = useList();
	const { updateList } = useListActions();
	const { mutateAsync: apiDeleteList } = useAPIDeleteList();
	const [name, setName] = useState(list?.name ?? '');
	const [points, setPoints] = useState(list?.points.toString() ?? '');
	const [isSaving, setIsSaving] = useState(false);
	const { mutateAsync: apiCreateList, isPending: copyListPending } =
		useAPICreateList();
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

			<Button content={'Copy'} loading={copyListPending} onPress={copyList} />

			<Button
				content={'Save'}
				disabled={!isValid}
				loading={isSaving}
				onPress={saveList}
			/>
		</Dialog>
	);
}
