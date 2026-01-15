import { useColorScheme } from 'nativewind';
import ColoursDef from '../Colours';

export interface Colours {
	background: string;
	primary: string;
	secondary: string;
	positive: string;
	negative: string;
	warning: string;
	info: string;
	text: string;
	muted: string;
}

export const useColours = (override?: 'light' | 'dark') => {
	const { colorScheme } = useColorScheme();

	if (colorScheme === 'light' && (!override || override === 'light')) {
		return {
			background: ColoursDef.background.light,
			primary: ColoursDef.primary.light,
			secondary: ColoursDef.secondary.light,
			positive: ColoursDef.positive.light,
			negative: ColoursDef.negative.light,
			warning: ColoursDef.warning.light,
			info: ColoursDef.info.light,
			text: ColoursDef.text.light,
			muted: ColoursDef.muted.light,
		} as Colours;
	}

	return {
		background: ColoursDef.background.dark,
		primary: ColoursDef.primary.dark,
		secondary: ColoursDef.secondary.dark,
		positive: ColoursDef.positive.dark,
		negative: ColoursDef.negative.dark,
		warning: ColoursDef.warning.dark,
		info: ColoursDef.info.dark,
		text: ColoursDef.text.dark,
		muted: ColoursDef.muted.dark,
	} as Colours;
};
