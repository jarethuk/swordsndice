export interface GroupResponseMember {
	id: string;
	username?: string | null;
	image?: string | null;
}

export interface GroupResponse {
	id: string;
	name: string;
	description?: string | null;
	image?: string | null;
	isPublic: boolean;
	membersCanInvite: boolean;
	members: GroupResponseMember[];
	invites: GroupResponseMember[];
	createdBy: GroupResponseMember;
}
