import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import { Button } from '../../components/common/Button';
import { Dialog } from '../../components/common/Dialog';
import { Input } from '../../components/common/Input';
import { useList, useListActions } from '../../states/useListStore';

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
	}, [isSaving, list, updateList, name, points]);

	return (
		<Dialog title={'Edit List'}>
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

			<Button
				content={'Save'}
				disabled={!isValid}
				loading={isSaving}
				onPress={saveList}
			/>
		</Dialog>
	);
}
