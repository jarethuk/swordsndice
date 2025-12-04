import type {ReactElement} from 'react';
import {NextWindowButton} from './NextWindowButton';

interface Props {
	title: string;
	icon?: ReactElement;
	bottom?: ReactElement;
	onPress: () => void;
}

export const PopupRow = ({ title, icon, onPress, bottom }: Props) => {
	return (
		<NextWindowButton
			onPress={onPress}
			label={title}
			iconStart={icon}
			bottom={bottom}
		/>
	);
};
