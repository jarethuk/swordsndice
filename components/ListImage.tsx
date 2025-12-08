import {faSword} from '@awesome.me/kit-34e2017de2/icons/duotone/solid';
import type {IconDefinition} from '@fortawesome/fontawesome-svg-core';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {Image, View} from 'react-native';

interface Props {
	image?: string | null;
	placeHolderIcon?: IconDefinition;
}

export const ListImage = ({ image, placeHolderIcon }: Props) => {
	return (
		<View
			className={
				'bg-panel-light dark:bg-panel-dark rounded-full flex items-center justify-center overflow-hidden h-[44px] w-[44px]'
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
				<FontAwesomeIcon icon={placeHolderIcon ?? faSword} size={44 - 24} />
			)}
		</View>
	);
};
