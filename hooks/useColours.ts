import { useColorScheme } from 'nativewind';
import ColoursDef from '../Colours';

export interface Colours {
	primary: string;
	secondary: string;
	muted: string;
}

export const useColours = () => {
	const { colorScheme } = useColorScheme();

	if (colorScheme === 'light') {
		return {
			primary: ColoursDef.primary.light,
			secondary: ColoursDef.secondary.light,
			muted: ColoursDef.muted.light,
		} as Colours;
	}

	return {
		primary: ColoursDef.primary.dark,
		secondary: ColoursDef.secondary.dark,
		muted: ColoursDef.muted.dark,
	} as Colours;
};
