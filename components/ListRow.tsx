import {faChevronRight} from '@awesome.me/kit-34e2017de2/icons/duotone/solid';
import type {IconDefinition} from '@fortawesome/fontawesome-svg-core';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {Pressable, View} from 'react-native';
import {useColours} from '../hooks/useColours';
import {Content} from './Content';
import {ListImage} from './ListImage';

interface Props {
	title: string;
	image?: string | null;
	subtitle?: string;
	right?: string;
	onPress?: () => void;
	placeHolderIcon: IconDefinition;
}

export default function ListRow({
	title,
	subtitle,
	right,
	image,
	onPress,
	placeHolderIcon,
}: Props) {
	const colours = useColours();

	return (
		<Pressable
			className={'flex flex-row w-full gap-4 items-center'}
			onPress={onPress}
		>
			<ListImage image={image} placeHolderIcon={placeHolderIcon} />

			<View className={'flex'}>
				<Content type={'title'} size={'xs'}>
					{title}
				</Content>

				{subtitle && (
					<Content type={'subtitle'} size={'md'} muted>
						{subtitle}
					</Content>
				)}
			</View>

			<View className={'flex flex-col ml-auto'}>
				{!!right && (
					<Content type={'title'} size={'xs'}>
						{right}
					</Content>
				)}
			</View>

			<FontAwesomeIcon icon={faChevronRight} size={16} color={colours.text} />
		</Pressable>
	);
}
