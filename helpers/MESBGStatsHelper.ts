import {MESBGArmySlot} from '../types';
import type {MESBGProfileStats} from '../types/MESBGProfileStats';
import type {Profile} from '../types/Profile';

export const getMESBGStats = (profile: Profile): MESBGProfileStats => {
	const [
		movement,
		fightValue,
		savingThrow,
		strength,
		defense,
		attacks,
		wounds,
		courage,
		intelligence,
		might,
		will,
		fate,
	] = profile.stats;

	return {
		movement,
		fightValue,
		savingThrow,
		strength,
		defense,
		attacks,
		wounds,
		courage,
		intelligence,
		might,
		will,
		fate,
	};
};

export const maxWarbandForLeader = (slot: MESBGArmySlot): number => {
	switch (slot) {
		case MESBGArmySlot.Legend:
			return 18;
		case MESBGArmySlot.Valour:
			return 15;
		case MESBGArmySlot.Fortitude:
			return 12;
		default:
			return 6;
	}
};
