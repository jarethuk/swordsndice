export enum StorageKey {
	User = 'User',
}

export enum Games {
	MESBG = 'MESBG',
	MESBGBC = 'MESBG: Battle Companies',
}

export const GamesList = Object.values(Games).map((value) => ({
	title: value,
	value,
}));

export enum MESBGArmySlot {
	Legend = 'Hero of Legend',
	Valour = 'Hero of Valour',
	Fortitude = 'Hero of Fortitude',
	Independent = 'Independent Hero',
	Warrior = 'Warrior',
}
