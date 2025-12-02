import type {Games} from './Enums';

export interface List {
	id: string;
	name: string;
	army?: string;
	game: Games;
	image?: string;
	description?: string;
	points?: number;
}
