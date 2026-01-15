import type { PublicUser } from './PublicUser';

export interface UserGroup {
	readonly id: string;
	readonly name: string;
	readonly description?: string;
	readonly image?: string;
	readonly isPublic: boolean;
	readonly membersCanInvite: boolean;
	readonly createdBy: PublicUser;
}
