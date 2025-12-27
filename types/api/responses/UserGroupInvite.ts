export interface CreatedBy {
	username: string;
	image?: string;
}

export interface UserGroupInvite {
	id: string;
	name: string;
	description?: string;
	image?: string;
	isPublic: boolean;
	membersCanInvite: boolean;
	createdBy: CreatedBy;
}
