import { View } from 'react-native';
import type { ArmyProfile } from '../types/ArmyProfile';
import { Content } from './Content';

interface Props {
	profile: ArmyProfile;
	variant: 'accent' | 'white';
}

type Stats = 'might' | 'will' | 'fate' | 'wounds';

interface RowProps {
	label: string;
	stat: Stats;
	profile: ArmyProfile;
	variant: 'accent' | 'white';
}

const Row = ({
	profile: { fullStats, remainingStats },
	stat,
	label,
	variant,
}: RowProps) => {
	const value: string | number =
		(remainingStats ? remainingStats[stat] : fullStats?.[stat]) ?? '0';

	return (
		<View className={'flex flex-row gap-1'}>
			<Content size={'md'} type={'subtitle'} variant={variant}>
				{label}
			</Content>

			<Content size={'md'} type={'subtitle'} variant={variant} muted>
				{value}
			</Content>
		</View>
	);
};

export default function HeroPoints({ profile, variant }: Props) {
	if (!profile.fullStats) return;

	return (
		<View className={'flex flex-row gap-4'}>
			<Row stat={'might'} label={'M'} profile={profile} variant={variant} />
			<Row stat={'will'} label={'W'} profile={profile} variant={variant} />
			<Row stat={'fate'} label={'F'} profile={profile} variant={variant} />
			<Row stat={'wounds'} label={'Wo'} profile={profile} variant={variant} />
		</View>
	);
}
