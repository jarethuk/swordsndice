export interface ListMemberEquipment {
	name: string;
	points: number;
}

export interface ListMember {
	id: string;
	name: string;
	points: number;
	equipment: ListMemberEquipment[];
	amount: number;
	slot: string;
	notes?: string;
	remainingStats?: number[];
}

export interface ListGroup {
	id: string;
	leader: ListMember;
	members: ListMember[];
}

export interface ListBody {
	id?: string;
	name: string;
	game: string;
	army: string;
	points: number;
	actualPoints: number;
	image?: string | null;
	description?: string | null;
	isDeleted?: boolean | null;
	groups: ListGroup[];
	hash?: string;
}
