import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import { useAPIGroup } from '../../api/groups/useAPIGroup';
import { useAPIUpdateGroup } from '../../api/groups/useAPIUpdateGroup';
import { Content } from '../../components';
import { Button } from '../../components/Button';
import { Dialog } from '../../components/Dialog';
import { Input } from '../../components/Input';
import { LoadingScreen } from '../../components/LoadingScreen';
import Toggle from '../../components/Toggle';

export default function EditGroupPopup() {
	const { id } = useLocalSearchParams();
	const [name, setName] = useState('');
	const [description, setDescription] = useState('');
	const [isPublic, setIsPublic] = useState(false);
	const [membersCanInvite, setMembersCanInvite] = useState(true);
	const { mutateAsync, isPending } = useAPIUpdateGroup(id as string);

	const { data: group, isLoading } = useAPIGroup(id as string);

	useEffect(() => {
		if (group) {
			setName(group.name);
			setDescription(group.description ?? '');
			setIsPublic(group.isPublic);
			setMembersCanInvite(group.membersCanInvite);
		}
	}, [
		group,
		id,
		isLoading,
		mutateAsync,
		setDescription,
		setIsPublic,
		setName,
		setMembersCanInvite,
	]);

	const isValid = useMemo(() => {
		return name.length > 3;
	}, [name]);

	const save = useCallback(async () => {
		if (!isValid && name) return;

		await mutateAsync({
			name,
			description,
			isPublic,
			membersCanInvite,
		});

		router.dismiss();
	}, [description, isPublic, isValid, membersCanInvite, mutateAsync, name]);

	if (isLoading) return <LoadingScreen message={'Loading group...'} />;

	return (
		<Dialog title={'Update Group'}>
			<Input
				placeholder={'Name'}
				value={name}
				onChange={setName}
				type={'text'}
				label={'Name'}
			/>

			<Input
				value={description}
				onChange={setDescription}
				type={'text'}
				label={'Description'}
				multiline
			/>

			<View className={'flex flex-row items-center'}>
				<Content size={'md'} type={'subtitle'}>
					Public?
				</Content>

				<Toggle
					className={'ml-auto'}
					value={isPublic}
					onChange={() => setIsPublic(!isPublic)}
				/>
			</View>

			<Content size={'sm'} type={'body'}>
				When disabled, only people you invite will be able to join and it will
				be hidden from search results.
			</Content>

			<View className={'flex flex-row items-center gap-4'}>
				<Content size={'md'} type={'subtitle'} wrap>
					Members can invite new members to the group?
				</Content>

				<Toggle
					className={'ml-auto'}
					value={membersCanInvite}
					onChange={() => setMembersCanInvite(!membersCanInvite)}
				/>
			</View>

			<Content size={'sm'} type={'body'}>
				When disabled, only admins can invite new members.
			</Content>

			<Button
				content={'Save'}
				disabled={!isValid}
				loading={isPending}
				onPress={save}
			/>
		</Dialog>
	);
}
