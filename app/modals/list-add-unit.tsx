import { faMagnifyingGlass } from '@awesome.me/kit-34e2017de2/icons/duotone/solid';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { View } from 'react-native';
import { Content } from '../../components';
import AmountSelector from '../../components/AmountSelector';
import { Button } from '../../components/Button';
import { Dialog } from '../../components/Dialog';
import EquipmentSelector from '../../components/EquipmentSelector';
import { FAIcon } from '../../components/FAIcon';
import HeroPoints from '../../components/HeroPoints';
import { Input } from '../../components/Input';
import { NextWindowButton } from '../../components/NextWindowButton';
import StatsRow from '../../components/StatsRow';
import { MESBGArmies } from '../../data/MESBGArmies';
import { MESBGProfiles } from '../../data/MESBGProfiles';
import {
	getListUniqueLeaders,
	getMESBGStats,
} from '../../helpers/MESBGStatsHelper';
import { getRandomId } from '../../helpers/RandomHelper';
import { useList, useListActions } from '../../states/useListStore';
import { MESBGArmySlot } from '../../types';
import type { ListMemberEquipment } from '../../types/api/ListBody';
import type { MESBGProfileStats } from '../../types/MESBGProfileStats';
import type { Profile } from '../../types/Profile';

interface ProfileWithStats extends Profile {
	slot: MESBGArmySlot;
	fullStats: MESBGProfileStats;
}

export default function AddUnitPopup() {
	const { groupId, availableUnits } = useLocalSearchParams();
	const list = useList();
	const { updateList } = useListActions();
	const [search, setSearch] = useState('');

	const [amount, setAmount] = useState(1);
	const [selected, setSelected] = useState<ProfileWithStats | undefined>();
	const [equipment, setEquipment] = useState<ListMemberEquipment[]>([]);

	const units: ProfileWithStats[] = useMemo(() => {
		if (!list) return [];
		const army = MESBGArmies.find((x) => x.name === list.army);

		if (!army) {
			return [];
		}

		const units: ProfileWithStats[] = [];

		for (const profile of army.profiles) {
			const unit = MESBGProfiles.find((x) => x.name === profile.name);
			if (!unit) continue;

			units.push({
				...unit,
				slot: profile.slot,
				fullStats: getMESBGStats(unit),
			});
		}

		const existingLeaders = getListUniqueLeaders(list);
		return units.filter((x) => !existingLeaders.includes(x.name));
	}, [list]);

	const filteredUnits = useMemo(() => {
		return units.filter((unit) =>
			unit.name.toLowerCase().includes(search.toLowerCase()),
		);
	}, [units, search]);

	const groups = useMemo(() => {
		const slots = new Set(filteredUnits.map(({ slot }) => slot));

		return Array.from(slots).map((slot) => ({
			name: slot,
			units: filteredUnits
				.filter((x) => x.slot === slot)
				.sort((a, b) => a.name.localeCompare(b.name)),
		}));
	}, [filteredUnits]);

	const onSave = useCallback(
		async (unit?: ProfileWithStats) => {
			if (!list) return;

			const group = list.groups.find((x) => x.id === groupId);
			const selectedUnit = unit ?? selected;

			if (!group || !selectedUnit) return;

			group.members.push({
				...selectedUnit,
				id: getRandomId(),
				equipment,
				amount,
			});

			await updateList({
				groups: list.groups,
			});

			router.dismiss();
		},
		[list, selected, equipment, amount, updateList, groupId],
	);

	let content = null;

	if (selected) {
		content = (
			<View className={'flex h-full flex-col gap-6 p-6 pb-12'}>
				<Content size={'sm'} type={'title'} center>
					{selected.name}
				</Content>

				<View
					className={
						'border-border-light dark:border-border-dark flex gap-4 rounded-2xl border-2 p-4'
					}
				>
					<Content size={'xs'} type={'title'}>
						Stats
					</Content>

					<StatsRow stats={selected.fullStats} />
				</View>

				<View className={'flex grow flex-col gap-6'}>
					<EquipmentSelector
						member={selected}
						equipment={equipment}
						setEquipment={setEquipment}
					/>

					{selected.slot === MESBGArmySlot.Warrior && (
						<View
							className={
								'border-border-light dark:border-border-dark flex gap-4 rounded-2xl border-2 p-4'
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
					)}
				</View>

				<Button content={'Save'} onPress={onSave} />
			</View>
		);
	} else {
		content = (
			<Dialog title={'Add a Unit'}>
				<Input
					placeholder={'Find list'}
					value={search}
					onChange={setSearch}
					type={'search'}
					iconStart={<FAIcon icon={faMagnifyingGlass} colour="primary" />}
				/>

				{groups.map(({ name, units }) => (
					<View key={name} className={'flex gap-6'}>
						<Content size={'md'} type={'subtitle'}>
							{name}
						</Content>

						{units.map((unit) => (
							<NextWindowButton
								key={unit.name}
								label={`${unit.name} (${unit.points}pts)`}
								onPress={() => {
									setSelected(unit);

									if (!unit?.equipment?.length) {
										void onSave(unit);
									}
								}}
								bottom={
									unit.slot !== MESBGArmySlot.Warrior ? (
										<HeroPoints profile={unit} variant={'white'} />
									) : undefined
								}
								subtitle={<StatsRow stats={unit.fullStats} />}
							/>
						))}
					</View>
				))}
			</Dialog>
		);
	}

	return content;
}
