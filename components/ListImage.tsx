import { faSword } from '@awesome.me/kit-6b5fd61d92/icons/duotone/solid';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { Image, View } from 'react-native';
import { FAIcon } from './FAIcon';

interface Props {
	image?: string | null;
	placeHolderIcon?: IconDefinition;
}

export const ListImage = ({ image, placeHolderIcon }: Props) => {
	return (
		<View
			className={
				'bg-panel-light dark:bg-panel-dark flex h-[44px] w-[44px] items-center justify-center overflow-hidden rounded-full'
			}
		>
			{image ? (
				<Image
					source={{
						uri: image,
						height: 44,
						width: 44,
					}}
				/>
			) : (
				<FAIcon icon={placeHolderIcon ?? faSword} size={44 - 24} />
			)}
		</View>
	);
};
