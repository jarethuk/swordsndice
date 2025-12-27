export interface CreateGameRequest {
	game: string;
	description?: string;
	image?: string;
	points: number;
	inviteCode: string;
}
