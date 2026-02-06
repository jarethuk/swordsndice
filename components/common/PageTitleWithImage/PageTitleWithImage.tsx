import {
	faChevronLeft,
	faEdit,
	faRefresh,
} from '@awesome.me/kit-6b5fd61d92/icons/duotone/solid';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, View } from 'react-native';
import { Content } from '../Content';
import { FAIcon } from '../FAIcon';

interface Props {
	title: string;
	description?: string | null;
	image?: string | null;
	placeholderIcon: IconDefinition;
	onEdit?: () => void;
	refetch?: () => void;
}

export const PageTitleWithImage = ({
	placeholderIcon,
	title,
	image,
	description,
	onEdit,
	refetch,
}: Props) => {
	return (
		<View className={'mt-6 mb-3 flex w-full flex-col items-center gap-4'}>
			<View className={'flex w-full flex-row gap-4'}>
				<Pressable
					onPress={() => router.back()}
					className={'flex h-12 w-12 items-center justify-center'}
					testID={'page-title-back'}
				>
					<FAIcon icon={faChevronLeft} size={20} />
				</Pressable>

				<View className={'flex grow items-center'}>
					<View
						className={
							'bg-panel-light dark:bg-panel-dark flex h-40 w-40 items-center justify-center overflow-hidden rounded-full'
						}
					>
						{image ? (
							<Image source={image} style={{ height: 160, width: 160 }} />
						) : (
							<View className={'flex flex-col items-center gap-4'}>
								<FAIcon icon={placeholderIcon} size={36} />
							</View>
						)}
					</View>
				</View>

				<View className={'flex min-h-12 min-w-12 items-center gap-2'}>
					{onEdit && (
						<Pressable
							onPress={onEdit}
							className={'h-12 w-12 items-center justify-center'}
							testID={'page-title-edit'}
						>
							<FAIcon icon={faEdit} size={20} />
						</Pressable>
					)}

					{refetch && (
						<Pressable
							onPress={refetch}
							className={'h-12 w-12 items-center justify-center'}
							testID={'page-title-refresh'}
						>
							<FAIcon icon={faRefresh} size={20} />
						</Pressable>
					)}
				</View>
			</View>

			<View className={'flex items-center gap-2'}>
				<Content type={'display'} size={'sm'} center>
					{title}
				</Content>

				{!!description && (
					<Content type={'body'} size={'md'} center>
						{description}
					</Content>
				)}
			</View>
		</View>
	);
};
