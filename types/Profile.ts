import type { Games } from './Enums';

export interface Equipment {
	name: string;
	points: number;
}

export interface Profile {
	game: Games;
	name: string;
	points: number;
	equipment: Equipment[];
	stats: string[];
	unique?: boolean;
}
