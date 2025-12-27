import type { ListBody } from '../ListBody.ts';
import type { PublicUser } from './PublicUser.ts';

export interface GameResponseMember {
  user?: PublicUser;
  list?: ListBody | null;
}

export interface GameResponse {
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
  members?: GameResponseMember[];
  invites?: PublicUser[];
}
