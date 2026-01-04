/* istanbul ignore file */
import type { PublicUser } from './PublicUser';

export interface UserGroupInvite {
	id: string;
	name: string;
	description?: string | null;
	image?: string | null;
	createdBy: PublicUser;
	createdAt: Date;
}
