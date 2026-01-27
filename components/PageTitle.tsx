import { faRefresh } from '@awesome.me/kit-6b5fd61d92/icons/duotone/solid';
import { Pressable, View } from 'react-native';
import { Content } from './Content';
import { FAIcon } from './FAIcon';

interface Props {
	refetch?: () => void;
	title?: string;
	subtitle?: string;
}

export const PageTitle = ({ refetch, title, subtitle }: Props) => {
	if (!title) return;

	return (
		<View className={'flex gap-4'}>
			<View className={'flex flex-row items-center gap-1'}>
				<View className={'w-4'} />

				<View className={'grow'}>
					<Content size={'sm'} type={'title'} center>
						{title}
					</Content>
				</View>

				<View className={'w-4'}>
					{refetch && (
						<Pressable onPress={refetch}>
							<FAIcon icon={faRefresh} />
						</Pressable>
					)}
				</View>
			</View>

			{subtitle && (
				<Content size={'md'} type={'body'} center>
					{subtitle}
				</Content>
			)}
		</View>
	);
};
