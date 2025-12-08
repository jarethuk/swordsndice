import type {Games} from './Enums';
import type {List} from './List';

export interface GameMember {
	username: string;
	image?: string;
	list?: List;
}

export interface Game {
	id: string;
	inviteCode: string;
	createdAt: Date;
	game: Games;
	points: number;
	image?: string;
	description?: string;
	members: GameMember[];
	isStarted?: boolean;
}
