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
