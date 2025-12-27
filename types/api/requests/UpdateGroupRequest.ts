export interface UpdateGroupRequest {
	name?: string;
	description?: string;
	image?: string;
	isPublic?: boolean;
	membersCanInvite?: boolean;
}
