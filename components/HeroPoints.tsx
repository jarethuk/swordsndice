import {View} from 'react-native';
import type {ArmyProfile} from '../types/ArmyProfile';
import {Content} from './Content';

interface Props {
	profile: ArmyProfile;
	variant: 'accent' | 'white';
}

export default function HeroPoints({ profile, variant }: Props) {
	if (!profile.fullStats) return;

	return (
		<View className={'flex flex-row gap-4'}>
			<View className={'flex flex-row gap-1'}>
				<Content size={'md'} type={'subtitle'} variant={variant}>
					M
				</Content>

				<Content size={'md'} type={'subtitle'} variant={variant} muted>
					{profile.fullStats.might}
				</Content>
			</View>

			<View className={'flex flex-row gap-1'}>
				<Content size={'md'} type={'subtitle'} variant={variant}>
					W
				</Content>

				<Content size={'md'} type={'subtitle'} variant={variant} muted>
					{profile.fullStats.will}
				</Content>
			</View>

			<View className={'flex flex-row gap-1'}>
				<Content size={'md'} type={'subtitle'} variant={variant}>
					F
				</Content>

				<Content size={'md'} type={'subtitle'} variant={variant} muted>
					{profile.fullStats.fate}
				</Content>
			</View>
		</View>
	);
}
