import type { MESBGArmySlot } from './Enums';
import type {
	MESBGProfileStats,
	RemainingMESBGProfileStats,
} from './MESBGProfileStats';

export interface BaseArmyProfile {
	name: string;
	fullStats?: MESBGProfileStats;
	remainingStats?: RemainingMESBGProfileStats;
}

export interface ArmyProfile extends BaseArmyProfile {
	slot: MESBGArmySlot;
}
