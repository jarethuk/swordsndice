import type { PublicUser } from './PublicUser.ts';

export interface GameResponseMember extends PublicUser {
	army?: string;
	isWinner?: boolean;
}

export interface GameListResponse {
	id: string;
	createdAt: Date;
	updatedAt: Date;
	createdBy: PublicUser;
	game: string;
	points: number;
	image?: string | null;
	inviteCode?: string | null;
	description?: string | null;
	isStarted: boolean;
	isComplete: boolean;
	members: GameResponseMember[];
	invites?: PublicUser[];
}
