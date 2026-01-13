import { faChevronLeft, faEdit } from '@awesome.me/kit-34e2017de2/icons/duotone/solid';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, View } from 'react-native';
import { useColours } from '../hooks/useColours';
import { Content } from './Content';

interface Props {
	title: string;
	description?: string | null;
	image?: string | null;
	placeholderIcon: IconDefinition;
	onEdit?: () => void;
}

export const PageTitleWithImage = ({
	placeholderIcon,
	title,
	image,
	description,
	onEdit,
}: Props) => {
	const colours = useColours();

	return (
		<View className={'mt-6 mb-3 flex w-full flex-col items-center gap-4'}>
			<View className={'flex w-full flex-row gap-4'}>
				<Pressable
					onPress={() => router.back()}
					className={'flex h-12 w-12 items-center justify-center'}
				>
					<FontAwesomeIcon
						icon={faChevronLeft}
						size={20}
						color={colours.text}
					/>
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
								<FontAwesomeIcon icon={placeholderIcon} size={36} />
							</View>
						)}
					</View>
				</View>

				{onEdit ? (
					<Pressable
						onPress={onEdit}
						className={'h-12 w-12 items-center justify-center'}
					>
						<FontAwesomeIcon icon={faEdit} size={20} color={colours.text} />
					</Pressable>
				) : (
					<View className={'h-12 w-12'} />
				)}
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
