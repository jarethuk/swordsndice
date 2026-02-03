import type { ListBody } from '../ListBody';
import type { GameListResponse } from './GameListResponse';
import type { PublicUser } from './PublicUser';

export interface PublicUserFull extends PublicUser {
	lists: ListBody[];
	games: GameListResponse[];
}
