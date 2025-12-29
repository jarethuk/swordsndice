import BadWords from 'bad-words';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Animated, View } from 'react-native';
import { useAPIUpdateUser } from '../api/user/useAPIUpdateUser';
import { useUser, useUserActions } from '../states/useUserStore';
import { Alert } from './Alert';
import { Button } from './Button';
import { Content } from './Content';
import { Input } from './Input';
import { ErrorMessage } from './ErrorMessage';
import ScrollView = Animated.ScrollView;

const badWords = new BadWords();

export const UsernameForm = () => {
	const [username, setUsername] = useState('');
	const user = useUser();
	const { setUser } = useUserActions();

	const sanitisedUsername = useMemo(() => {
		const match = username.match(/^[A-Za-z]+/);

		if (!match || !match.length) return '';

		return match[0].toLowerCase().trim();
	}, [username]);

	const isProfaneUsername = useMemo(() => {
		return badWords.isProfane(sanitisedUsername);
	}, [sanitisedUsername]);

	const isTooShort = sanitisedUsername.length < 4;
	const isValid = !isProfaneUsername && !isTooShort;

	const { mutate, isPending, isSuccess, error } = useAPIUpdateUser();

	useEffect(() => {
		if (isSuccess && user) {
			setUser({
				...user,
				username: sanitisedUsername,
			});
		}
	}, [isSuccess, sanitisedUsername, user, setUser]);

	const save = useCallback(() => {
		mutate({ username: sanitisedUsername });
	}, [sanitisedUsername, mutate]);

	return (
		<ScrollView
			contentContainerClassName={'p-4 flex gap-12 h-full bg-background-dark'}
			automaticallyAdjustKeyboardInsets={true}
		>
			<Content type={'title'} size={'md'} center>
				Choose a username
			</Content>

			<Content type={'subtitle'} size={'md'} center>
				This username allows others to find you for games. It is publicly
				visible so be sensible.
			</Content>

			<View className={'flex flex-col gap-4'}>
				<Input
					value={username}
					onChange={setUsername}
					type={'text'}
					label={'Username'}
				/>

				<Content type={'body'} size={'md'} center muted>
					Your username will be visible to other players
				</Content>

				{username.toLowerCase() !== sanitisedUsername && (
					<Alert
						type={'info'}
						message={`Actual username will be: ${sanitisedUsername}`}
					/>
				)}

				{isProfaneUsername && (
					<Content type={'body'} size={'md'} center variant={'negative'}>
						Keep it clean please!
					</Content>
				)}

				{isTooShort && (
					<Content type={'body'} size={'md'} center variant={'negative'}>
						Must be at least 4 characters long
					</Content>
				)}
			</View>

			<ErrorMessage error={error} />

			<Button
				content={'Continue'}
				disabled={!isValid}
				loading={isPending}
				onPress={save}
			/>
		</ScrollView>
	);
};
