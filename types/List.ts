import type {Games} from './Enums';

export interface List {
	id: string;
	createdAt: Date;
	name: string;
	game: Games;
	army: string;
	image?: string;
	description?: string;
	points: number;
	groups: any[];
}
