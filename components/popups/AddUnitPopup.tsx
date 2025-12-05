import {useCallback, useMemo, useState} from 'react';
import {View} from 'react-native';
import {MESBGArmies} from '../../data/MESBGArmies';
import {MESBGProfiles} from '../../data/MESBGProfiles';
import {updateDBList} from '../../db/DBLists';
import {getMESBGStats} from '../../helpers/MESBGStatsHelper';
import {getRandomId} from '../../helpers/RandomHelper';
import {MESBGArmySlot} from '../../types';
import type {List, ListMemberEquipment} from '../../types/List';
import type {MESBGProfileStats} from '../../types/MESBGProfileStats';
import type {Profile} from '../../types/Profile';
import AmountSelector from '../AmountSelector';
import {Button} from '../Button';
import {Content} from '../Content';
import EquipmentSelector from '../EquipmentSelector';
import {Popup} from '../Popup';
import {PopupRow} from '../PopupRow';
import StatsRow from '../StatsRow';

interface Props {
	onDismiss: () => void;
	onSelect: () => void;
	list: List;
	groupId: string;
	availableUnits: number;
}

interface ProfileWithStats extends Profile {
	slot: MESBGArmySlot;
	fullStats: MESBGProfileStats;
}

export default function AddUnitPopup({
	onDismiss,
	list,
	onSelect,
	groupId,
	availableUnits,
}: Props) {
	const [amount, setAmount] = useState(1);
	const [selected, setSelected] = useState<ProfileWithStats | undefined>();
	const [equipment, setEquipment] = useState<ListMemberEquipment[]>([]);

	const warriors: ProfileWithStats[] = useMemo(() => {
		const army = MESBGArmies.find((x) => x.name === list.army);

		if (!army) {
			return [];
		}

		const units: ProfileWithStats[] = [];

		for (const profile of army.profiles) {
			if (profile.slot !== MESBGArmySlot.Warrior) continue;

			const unit = MESBGProfiles.find((x) => x.name === profile.name);
			if (!unit) continue;

			units.push({
				...unit,
				slot: profile.slot,
				fullStats: getMESBGStats(unit),
			});
		}

		return units;
	}, [list]);

	const onSave = useCallback(async () => {
		const group = list.groups.find((x) => x.id === groupId);

		if (!group || !selected) return;

		group.members.push({
			...selected,
			id: getRandomId(),
			equipment,
			amount,
		});

		await updateDBList(list.id, {
			groups: list.groups,
		});

		onSelect();
	}, [list, groupId, selected, equipment, amount, onSelect]);

	let content = null;

	if (selected) {
		content = (
			<View className={'flex flex-col gap-6'}>
				<Content size={'xs'} type={'title'} center>
					Quantity & Equipment
				</Content>
				<EquipmentSelector
					member={selected}
					equipment={equipment}
					setEquipment={setEquipment}
				/>

				<AmountSelector
					value={amount}
					onChange={(value) => {
						setAmount(value);
					}}
					max={availableUnits}
				/>

				<Button content={'Save'} onPress={onSave} />
			</View>
		);
	} else {
		content = (
			<View className={'flex flex-col gap-6'}>
				<Content size={'xs'} type={'title'} center>
					Add a Unit
				</Content>

				{warriors.map((unit) => (
					<PopupRow
						key={unit.name}
						title={unit.name}
						onPress={() => setSelected(unit)}
						subtitle={<StatsRow profile={unit} />}
					/>
				))}
			</View>
		);
	}

	return <Popup onDismiss={onDismiss}>{content}</Popup>;
}
