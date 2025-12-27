export interface GroupMember {
	id: string;
	username: string;
	image?: string;
	isAdmin?: boolean;
}

export interface Group {
	id: string;
	createdAt: Date;
	name: string;
	image?: string;
	description?: string;
	isPublic: boolean;
	members: GroupMember[];
}
