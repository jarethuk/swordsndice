import { View } from 'react-native';
import type { MESBGProfileStats } from '../../types/MESBGProfileStats';
import { Content } from '../common/Content';

interface Props {
  stats: MESBGProfileStats;
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

export default function StatsRow({ stats }: Props) {
  if (!stats) return;

  return (
    <View className={'flex flex-row justify-evenly gap-6'}>
      <Stat name={'Mv'} value={stats.movement} isInches />
      <Stat name={'Fv'} value={stats.fightValue} />
      <Stat name={'Sv'} value={stats.shootValue} isPlus />
      <Stat name={'S'} value={stats.strength} />
      <Stat name={'D'} value={stats.defense} />
      <Stat name={'A'} value={stats.attacks} />
      <Stat name={'W'} value={stats.wounds} />
      <Stat name={'C'} value={stats.courage} isPlus />
      <Stat name={'I'} value={stats.intelligence} isPlus />
    </View>
  );
}
