import type {ArmyProfile} from './ArmyProfile';
import type {Games} from './Enums';

export interface Army {
	game: Games;
	name: string;
	group?: string;
	attributes?: string[];
	overrideBowLimit?: number;
	profiles: ArmyProfile[];
}
