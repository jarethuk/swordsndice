import type {MESBGArmySlot} from './Enums';
import type {MESBGProfileStats} from './MESBGProfileStats';

export interface BaseArmyProfile {
	name: string;
	fullStats?: MESBGProfileStats;
}

export interface ArmyProfile extends BaseArmyProfile {
	slot: MESBGArmySlot;
}
