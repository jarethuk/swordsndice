import {router, useLocalSearchParams} from 'expo-router';
import {useCallback, useMemo, useState} from 'react';
import {View} from 'react-native';
import {Content} from '../../components';
import AmountSelector from '../../components/AmountSelector';
import {Button} from '../../components/Button';
import EquipmentSelector from '../../components/EquipmentSelector';
import {NextWindowButton} from '../../components/NextWindowButton';
import StatsRow from '../../components/StatsRow';
import {MESBGArmies} from '../../data/MESBGArmies';
import {MESBGProfiles} from '../../data/MESBGProfiles';
import {getMESBGStats} from '../../helpers/MESBGStatsHelper';
import {getRandomId} from '../../helpers/RandomHelper';
import {useList, useListActions} from '../../states/useListStore';
import {MESBGArmySlot} from '../../types';
import type {ListMemberEquipment} from '../../types/List';
import type {MESBGProfileStats} from '../../types/MESBGProfileStats';
import type {Profile} from '../../types/Profile';

interface ProfileWithStats extends Profile {
	slot: MESBGArmySlot;
	fullStats: MESBGProfileStats;
}

export default function AddUnitPopup() {
	const { groupId, availableUnits } = useLocalSearchParams();
	const list = useList();
	const { updateList } = useListActions();

	const [amount, setAmount] = useState(1);
	const [selected, setSelected] = useState<ProfileWithStats | undefined>();
	const [equipment, setEquipment] = useState<ListMemberEquipment[]>([]);

	const warriors: ProfileWithStats[] = useMemo(() => {
		if (!list) return [];
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
		if (!list) return;

		const group = list.groups.find((x) => x.id === groupId);

		if (!group || !selected) return;

		group.members.push({
			...selected,
			id: getRandomId(),
			equipment,
			amount,
		});

		await updateList({
			groups: list.groups,
		});

		router.dismiss();
	}, [list, groupId, selected, equipment, amount]);

	let content = null;

	if (selected) {
		content = (
			<View className={'flex flex-col gap-6 p-6 pb-12 h-full'}>
				<Content size={'sm'} type={'title'} center>
					{selected.name}
				</Content>

				<View
					className={
						'flex gap-4 border-2 border-border-light dark:border-border-dark p-4 rounded-2xl'
					}
				>
					<Content size={'xs'} type={'title'}>
						Stats
					</Content>

					<StatsRow profile={selected} />
				</View>

				<View className={'flex flex-col gap-6 grow'}>
					<EquipmentSelector
						member={selected}
						equipment={equipment}
						setEquipment={setEquipment}
					/>

					<View
						className={
							'flex gap-4 border-2 border-border-light dark:border-border-dark p-4 rounded-2xl'
						}
					>
						<Content size={'xs'} type={'title'}>
							Unit Size
						</Content>

						<AmountSelector
							value={amount}
							onChange={(value) => {
								setAmount(value);
							}}
							max={Number(availableUnits ?? 0)}
						/>
					</View>
				</View>

				<Button content={'Save'} onPress={onSave} />
			</View>
		);
	} else {
		content = (
			<View className={'flex flex-col gap-6 p-6'}>
				<Content size={'sm'} type={'title'} center>
					Add a Unit
				</Content>

				<Content size={'md'} type={'subtitle'}>
					Warriors
				</Content>

				{warriors.map((unit) => (
					<NextWindowButton
						key={unit.name}
						label={unit.name}
						onPress={() => setSelected(unit)}
						subtitle={<StatsRow profile={unit} />}
					/>
				))}
			</View>
		);
	}

	return content;
}
