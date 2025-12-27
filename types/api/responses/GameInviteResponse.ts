import type { PublicUser } from './PublicUser';

export interface GameInviteResponse {
  id: string;
  createdAt: Date;
  invitedBy: PublicUser;
  game: string;
  points: number;
}
