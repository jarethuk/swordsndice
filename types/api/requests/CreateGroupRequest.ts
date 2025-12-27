export interface CreateGroupRequest {
	name: string;
	description?: string;
	image?: string;
	isPublic?: boolean;
	membersCanInvite?: boolean;
}
