export interface GroupMember {
	id: string;
	username: string;
	image?: string;
}

export interface Group {
	id: string;
	createdAt: Date;
	name: string;
	image?: string;
	description?: string;
	isPublic: boolean;
	admins: string[];
	members: GroupMember[];
}
