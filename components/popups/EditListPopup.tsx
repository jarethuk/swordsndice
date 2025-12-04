import {router} from 'expo-router';
import {useCallback, useState} from 'react';
import {View} from 'react-native';
import {deleteDBList, updateDBList} from '../../db/DBLists';
import type {List} from '../../types/List';
import {Button} from '../Button';
import {Content} from '../Content';
import Divider from '../Divider';
import {Input} from '../Input';
import {Popup} from '../Popup';
import AreYouSurePopup from './AreYouSurePopup';

interface Props {
	onDismiss: () => void;
	list: List;
}

export default function EditListPopup({ onDismiss, list }: Props) {
	const [name, setName] = useState(list.name);
	const [points, setPoints] = useState(list.points.toString());
	const [isSaving, setIsSaving] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);

	const isValid = name && points && Number(points) > 0;

	const saveList = useCallback(async () => {
		if (isSaving) return;

		setIsSaving(true);

		await updateDBList(list.id, {
			name,
			points: Number(points),
		});

		setIsSaving(false);
		onDismiss();
	}, [list, name, points, isSaving, onDismiss]);

	const deleteList = useCallback(async () => {
		if (!list) return;
		setIsDeleting(false);
		await deleteDBList(list.id);
		router.back();
	}, [list]);

	if (isDeleting) {
		return (
			<AreYouSurePopup
				onDismiss={() => setIsDeleting(false)}
				onConfirm={deleteList}
				message={'Delete this list? This cannot be undone.'}
			/>
		);
	}

	return (
		<Popup onDismiss={onDismiss}>
			<View className={'flex flex-col gap-6'}>
				<Content size={'xs'} type={'title'} center>
					Edit List
				</Content>

				<Input
					placeholder={'Name'}
					value={name}
					onChange={setName}
					type={'text'}
					isBottomSheet
				/>

				<Input
					placeholder={'Points'}
					value={points}
					onChange={setPoints}
					type={'numeric'}
					isBottomSheet
				/>

				<Button
					content={'Save'}
					disabled={!isValid}
					loading={isSaving}
					onPress={saveList}
				/>

				<Divider />

				<Button
					content={'Delete'}
					variant={'negative'}
					onPress={() => setIsDeleting(true)}
				/>
			</View>
		</Popup>
	);
}
