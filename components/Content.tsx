import type {PropsWithChildren} from 'react';
import {Text} from 'react-native';
import {useColours} from '../hooks/useColours';

interface Props extends PropsWithChildren {
	variant?: 'accent' | 'positive' | 'negative' | 'white';
	type?: 'display' | 'title' | 'subtitle' | 'body' | 'cta' | 'note';
	size?: 'xl' | 'lg' | 'md' | 'sm' | 'xs';
	center?: boolean;
	right?: boolean;
	muted?: boolean;
	lineHeightOverride?: number;
	wrap?: boolean;
}

export const Content = ({
	variant,
	type,
	size,
	children,
	center,
	right,
	muted,
	lineHeightOverride,
	wrap,
}: Props) => {
	const colours = useColours();
	let fontFamily: string;
	let fontSize = 16;
	let lineHeight = 1.2;

	switch (type) {
		case 'display':
			fontFamily = 'Nunito_900Black';
			lineHeight = 1.5;

			switch (size) {
				case 'xl':
					fontSize = 60;
					break;
				case 'lg':
					fontSize = 48;
					break;
				case 'md':
					fontSize = 40;
					break;
				case 'sm':
					fontSize = 32;
					break;
			}
			break;
		case 'title':
			fontFamily = 'Nunito_800ExtraBold';
			lineHeight = 1.5;

			switch (size) {
				case 'lg':
					fontSize = 28;
					break;
				case 'md':
					fontSize = 24;
					break;
				case 'sm':
					fontSize = 20;
					break;
				case 'xs':
					fontSize = 16;
					break;
			}
			break;
		case 'subtitle':
			fontFamily = 'DINRoundPro';

			switch (size) {
				case 'xl':
					fontSize = 20;
					break;
				case 'lg':
					fontSize = 18;
					break;
				case 'md':
					fontSize = 16;
					break;
				case 'sm':
					fontSize = 14;
					break;
				case 'xs':
					fontSize = 12;
					break;
			}
			break;

		case 'cta':
			fontFamily = 'Nunito_800ExtraBold';

			switch (size) {
				case 'lg':
					fontSize = 16;
					break;
				case 'md':
					fontSize = 14;
					break;
			}
			break;

		default:
			fontFamily = 'Nunito_500Medium';

			switch (size) {
				case 'lg':
					fontSize = 18;
					break;
				case 'sm':
					fontSize = 14;
					break;
				case 'xs':
					fontSize = 12;
					break;
				default:
					fontSize = 16;
					break;
			}
			break;
	}

	let colour = colours.text;

	switch (variant) {
		case 'accent':
			colour = colours.primary;
			break;
		case 'white':
			colour = 'white';
			break;
		case 'positive':
			colour = colours.positive;
			break;
		case 'negative':
			colour = colours.negative;
			break;
	}

	return (
		<Text
			style={[
				{
					fontFamily,
					lineHeight: fontSize * (lineHeightOverride ?? lineHeight),
					fontSize,
					...(wrap ? { flexShrink: 1 } : {}),
					...(right ? { textAlign: 'right' } : {}),
					...(center ? { textAlign: 'center' } : {}),
					...(muted ? { opacity: 0.5 } : {}),
					color: colour,
				},
			]}
		>
			{children}
		</Text>
	);
};
