import type {ReactElement} from 'react';
import {NextWindowButton} from './NextWindowButton';

interface Props {
	title: string;
	icon?: ReactElement;
	onPress: () => void;
}

export const PopupRow = ({ title, icon, onPress }: Props) => {
	return <NextWindowButton onPress={onPress} label={title} iconStart={icon} />;
};
