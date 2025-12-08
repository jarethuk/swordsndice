import type {Games, MESBGArmySlot} from './Enums';

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
	slot: MESBGArmySlot;
	notes?: string;
}

export interface ListGroup {
	id: string;
	leader: ListMember;
	members: ListMember[];
}

export interface List {
	id: string;
	createdAt: Date;
	name: string;
	game: Games;
	army: string;
	image?: string;
	description?: string;
	points: number;
	groups: ListGroup[];
}
