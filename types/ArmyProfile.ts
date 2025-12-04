import type {MESBGArmySlot} from './Enums';
import type {MESBGProfileStats} from './MESBGProfileStats';

export interface ArmyProfile {
	name: string;
	slot: MESBGArmySlot;
	fullStats?: MESBGProfileStats;
}
