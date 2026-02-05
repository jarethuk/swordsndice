import { faStar } from '@awesome.me/kit-6b5fd61d92/icons/duotone/solid';
import { Content } from 'components/common/Content';
import { router } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';
import { useAPICreateFeedback } from '../../api/feedback/useAPICreateFeedback';
import { Button } from '../../components/common/Button';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { FAIcon } from '../../components/common/FAIcon';
import { Input } from '../../components/common/Input';
import { Page } from '../../components/common/Page';

export default function FeedbackPage() {
	const [rating, setRating] = useState(0);
	const [message, setMessage] = useState('');
	const {
		mutateAsync: apiCreateFeedback,
		isPending,
		error,
	} = useAPICreateFeedback();
	const [showSuccess, setShowSuccess] = useState(false);

	const stars = useMemo(() => {
		const stars = [];

		for (let i = 1; i <= 5; i++) {
			stars.push(
				<Pressable
					key={i}
					onPress={() => setRating(i)}
					className={'flex items-center'}
				>
					<FAIcon
						icon={faStar}
						colour={rating >= i ? 'warning' : 'text'}
						size={32}
						solid
					/>
				</Pressable>,
			);
		}

		return stars;
	}, [rating]);

	const submit = useCallback(async () => {
		await apiCreateFeedback({
			rating,
			message,
		});

		setShowSuccess(true);
	}, [apiCreateFeedback, message, rating]);

	const isValid = useMemo(() => {
		return !(!rating && !message);
	}, [rating, message]);

	if (showSuccess) {
		return (
			<Page>
				<Content size={'sm'} type={'title'} center>
					Feedback
				</Content>

				<Content size={'sm'} type={'subtitle'} center>
					Thanks for the feedback!
				</Content>

				<Button content={'Back'} onPress={() => router.back()} />
			</Page>
		);
	}

	return (
		<Page>
			<Content size={'sm'} type={'title'} center>
				Feedback
			</Content>

			<View className={'flex gap-12'}>
				<Content size={'sm'} type={'subtitle'} center>
					Love it? Hate it? Found a bug? Have a suggestion? Let us know!
				</Content>

				<View className={'flex flex-row justify-center gap-4'}>{stars}</View>

				<Input
					value={message}
					onChange={setMessage}
					type={'text'}
					label={'Message'}
					multiline
				/>
			</View>

			<ErrorMessage error={error} />

			<Button
				content={'Send Feedback'}
				disabled={!isValid}
				loading={isPending}
				onPress={submit}
			/>
		</Page>
	);
}
