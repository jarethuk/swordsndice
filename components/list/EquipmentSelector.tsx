import { useCallback, useMemo } from 'react';
import { View } from 'react-native';
import { MESBGProfiles } from '../../data/MESBGProfiles';
import type { ListMemberEquipment } from '../../types/api/ListBody';
import type { Equipment } from '../../types/Profile';
import { Content } from '../common/Content';
import Toggle from '../common/Toggle';

interface Props {
  member: { name: string };
  equipment: ListMemberEquipment[];
  setEquipment: (selected: ListMemberEquipment[]) => void;
}

export default function EquipmentSelector({ member, equipment, setEquipment }: Props) {
  const profile = useMemo(() => {
    return MESBGProfiles.find((x) => x.name === member.name);
  }, [member]);

  const onChange = useCallback(
    (changed: Equipment) => {
      const index = equipment.findIndex((x) => x.name === changed.name);

      if (index >= 0) {
        const newSelected = [...equipment];
        newSelected.splice(index, 1);
        setEquipment(newSelected);
      } else {
        setEquipment([...equipment, changed]);
      }
    },
    [equipment, setEquipment]
  );

  if (!profile) return;

  return (
    <View
      className={
        'border-border-light dark:border-border-dark flex flex-col gap-4 rounded-2xl border-2 p-4'
      }>
      <Content size={'xs'} type={'title'}>
        Equipment
      </Content>

      {profile?.equipment?.map((item) => (
        <View key={item.name} className={'flex flex-row items-center gap-4'}>
          <Content size={'md'} type={'subtitle'} wrap muted>
            {item.name} ({item.points}pts)
          </Content>

          <Toggle
            className={'ml-auto'}
            value={!!equipment.find((x) => x.name === item.name)}
            onChange={() => onChange(item)}
          />
        </View>
      ))}

      {!profile?.equipment?.length && (
        <Content size={'md'} type={'subtitle'} wrap muted>
          No equipment available
        </Content>
      )}
    </View>
  );
}
