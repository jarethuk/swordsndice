import {View} from 'react-native';
import type {BaseArmyProfile} from '../types/ArmyProfile';
import {Content} from './Content';

interface Props {
	profile: BaseArmyProfile;
}

interface StatProps {
	name: string;
	value: string;
	isPlus?: boolean;
	isInches?: boolean;
}

const Stat = ({ name, value, isPlus, isInches }: StatProps) => {
	return (
		<View className={'flex flex-col items-center'}>
			<Content size={'sm'} type={'subtitle'}>
				{name}
			</Content>

			<Content size={'sm'} type={'subtitle'} muted>
				{isPlus && '+'}
				{value}
				{isInches && '"'}
			</Content>
		</View>
	);
};

export default function StatsRow({ profile }: Props) {
	if (!profile.fullStats) return;

	return (
		<View className={'flex flex-row gap-6 justify-evenly'}>
			<Stat name={'Mv'} value={profile.fullStats.movement} isInches />
			<Stat name={'Fv'} value={profile.fullStats.fightValue} />
			<Stat name={'Sv'} value={profile.fullStats.shootValue} isPlus />
			<Stat name={'S'} value={profile.fullStats.strength} />
			<Stat name={'D'} value={profile.fullStats.defense} />
			<Stat name={'A'} value={profile.fullStats.attacks} />
			<Stat name={'W'} value={profile.fullStats.wounds} />
			<Stat name={'C'} value={profile.fullStats.courage} isPlus />
			<Stat name={'I'} value={profile.fullStats.intelligence} isPlus />
		</View>
	);
}
