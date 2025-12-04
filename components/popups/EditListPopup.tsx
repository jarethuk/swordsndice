import {useCallback, useState} from 'react';
import {View} from 'react-native';
import {updateDBList} from '../../db/DBLists';
import type {List} from '../../types/List';
import {Button} from '../Button';
import {Content} from '../Content';
import {Input} from '../Input';
import {Popup} from '../Popup';

interface Props {
	onDismiss: () => void;
	list: List;
}

export default function EditListPopup({ onDismiss, list }: Props) {
	const [name, setName] = useState(list.name);
	const [points, setPoints] = useState(list.points.toString());
	const [isSaving, setIsSaving] = useState(false);

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
			</View>
		</Popup>
	);
}
