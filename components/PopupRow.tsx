import type {ReactElement} from 'react';
import {NextWindowButton} from './NextWindowButton';

interface Props {
	title: string | ReactElement;
	subtitle?: string | ReactElement;
	icon?: ReactElement;
	bottom?: ReactElement;
	onPress: () => void;
}

export const PopupRow = ({ title, icon, onPress, bottom, subtitle }: Props) => {
	return (
		<NextWindowButton
			onPress={onPress}
			label={title}
			iconStart={icon}
			bottom={bottom}
			subtitle={subtitle}
		/>
	);
};
