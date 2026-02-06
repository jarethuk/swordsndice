import { faChevronRight } from '@awesome.me/kit-6b5fd61d92/icons/duotone/solid';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import type { ReactElement } from 'react';
import { Pressable, View } from 'react-native';
import { Content } from '../Content';
import { FAIcon } from '../FAIcon';
import { ListImage } from '../ListImage';

interface Props {
	title: string;
	image?: string | null;
	subtitle?: string | ReactElement;
	right?: string;
	onPress?: () => void;
	placeHolderIcon: IconDefinition;
	rightIcon?: IconDefinition;
}

export default function ListRow({
	title,
	subtitle,
	right,
	image,
	onPress,
	placeHolderIcon,
	rightIcon = faChevronRight,
}: Props) {
	return (
		<Pressable
			className={'flex w-full flex-row items-center gap-4'}
			onPress={onPress}
		>
			<ListImage image={image} placeHolderIcon={placeHolderIcon} />

			<View className={'flex shrink'}>
				<Content type={'title'} size={'xs'} wrap>
					{title}
				</Content>

				{subtitle &&
					(typeof subtitle === 'string' ? (
						<Content type={'subtitle'} size={'md'} muted>
							{subtitle}
						</Content>
					) : (
						subtitle
					))}
			</View>

			<View className={'ml-auto flex flex-col'}>
				{!!right && (
					<Content type={'title'} size={'xs'}>
						{right}
					</Content>
				)}
			</View>

			{onPress && <FAIcon icon={rightIcon} />}
		</Pressable>
	);
}
