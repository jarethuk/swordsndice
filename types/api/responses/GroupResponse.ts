import type { PublicUser } from './PublicUser';

export interface GroupResponseMember {
  id: string;
  username?: string | null;
  image?: string | null;
  isAdmin?: boolean;
}

export interface GroupInviteResponse {
  user: PublicUser;
  createdBy: PublicUser;
}

export interface GroupResponse {
  id: string;
  name: string;
  description?: string | null;
  image?: string | null;
  isPublic: boolean;
  membersCanInvite: boolean;
  members: GroupResponseMember[];
  invites: GroupInviteResponse[];
  createdBy: GroupResponseMember;
}
