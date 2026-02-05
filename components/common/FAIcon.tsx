import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { type Colours, useColours } from '../../hooks/useColours';

interface Props {
	icon: IconDefinition;
	size?: number;
	colour?: keyof Colours | 'white';
	solid?: boolean;
}

export const FAIcon = ({ icon, size = 16, colour = 'text', solid }: Props) => {
	const colours = useColours();

	return (
		<FontAwesomeIcon
			icon={icon}
			size={size}
			color={colour === 'white' ? 'white' : colours[colour]}
			secondaryOpacity={solid ? 1 : undefined}
		/>
	);
};
