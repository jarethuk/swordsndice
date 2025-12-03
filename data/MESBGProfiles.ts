import {Games} from '../types';
import type {Profile} from '../types/Profile';

const Profiles: Partial<Profile>[] = [
	{
		name: 'Frodo Baggins',
		points: 55,
		stats: [4, 3, 3, 2, 3, 1, 2, 4, 5, 2, 3, 3],
		equipment: [
			{
				name: 'Mithril Coat',
				points: 15,
			},
			{
				name: 'Elven Coat',
				points: 5,
			},
			{
				name: 'Sting',
				points: 5,
			},
		],
	},
	{
		name: 'Samwise Gamgee',
		points: 40,
		stats: [4, 3, 3, 2, 3, 2, 2, 4, 5, 2, 2, 2],
		equipment: [
			{
				name: 'Elven cloak',
				points: 5,
			},
		],
	},
	{
		name: 'Meriadoc Brandybuck',
		points: 10,
		stats: [4, 3, 3, 2, 3, 1, 1, 6, 6, 0, 0, 2],
		equipment: [
			{
				name: 'Elven cloak',
				points: 5,
			},
		],
	},
	{
		name: 'Peregrin Took',
		points: 10,
		stats: [4, 3, 3, 2, 3, 1, 1, 6, 7, 0, 0, 2],
		equipment: [
			{
				name: 'Elven cloak',
				points: 5,
			},
		],
	},
	{
		name: 'Gandalf the Grey',
		points: 170,
		stats: [6, 5, 4, 4, 5, 2, 3, 3, 3, 3, 6, 3],
		equipment: [
			{
				name: "Gandalf's Cart",
				points: 25,
			},
			{
				name: 'Horse',
				points: 20,
			},
		],
	},
	{
		name: 'Aragorn (Strider)',
		points: 160,
		stats: [6, 7, 3, 4, 5, 3, 3, 4, 3, 3, 3, 3],
		equipment: [
			{
				name: 'Anduril, Flame of the West',
				points: 40,
			},
			{
				name: 'Brego',
				points: 20,
			},
			{
				name: 'Armour',
				points: 5,
			},
			{
				name: 'Bow',
				points: 5,
			},
			{
				name: 'Elven cloak',
				points: 5,
			},
		],
	},
	{
		name: 'Legolas Greenleaf',
		points: 100,
		stats: [6, 6, 2, 4, 4, 2, 2, 4, 4, 3, 2, 3],
		equipment: [
			{
				name: 'Horse',
				points: 20,
			},
			{
				name: 'Armour',
				points: 5,
			},
			{
				name: 'Elven cloak',
				points: 5,
			},
		],
	},
	{
		name: 'Gimli, Son of Gloin',
		points: 100,
		stats: [5, 6, 4, 4, 8, 2, 2, 4, 6, 3, 2, 3],
		equipment: [
			{
				name: 'Elven cloak',
				points: 5,
			},
		],
	},
	{
		name: 'Boromir of Gondor',
		points: 95,
		stats: [6, 7, 4, 4, 5, 3, 3, 4, 5, 6, 1, 0],
		equipment: [
			{
				name: 'Horse',
				points: 20,
			},
			{
				name: 'Elven cloak',
				points: 5,
			},
			{
				name: 'Shield',
				points: 5,
			},
		],
	},
	{
		name: 'Bill the Pony',
		points: 25,
		stats: [8, 2, 6, 3, 4, 1, 2, 6, 7, 0, 1, 2],
	},
	{
		name: 'Bilbo Baggins, Ageing Hobbit',
		points: 45,
		stats: [4, 3, 3, 2, 2, 1, 2, 4, 5, 1, 3, 3],
		equipment: [
			{
				name: 'Mithril Coat',
				points: 15,
			},
			{
				name: 'Sting',
				points: 5,
			},
			{
				name: 'The One Ring',
				points: 0,
			},
		],
	},
	{
		name: 'Lobelia Sackville-Baggins',
		points: 20,
		stats: [4, 2, 3, 2, 2, 1, 1, 4, 6, 0, 4, 1],
	},
	{
		name: 'Farmer Maggot',
		points: 50,
		stats: [4, 3, 3, 3, 3, 2, 2, 5, 5, 1, 2, 2],
	},
	{
		name: "Hamfest 'Gaffer' Gamgee",
		points: 35,
		stats: [4, 2, 3, 2, 3, 1, 2, 5, 7, 1, 1, 2],
	},
	{
		name: 'Rosie Cotton',
		points: 20,
		stats: [4, 1, 3, 2, 3, 1, 1, 7, 7, 0, 1, 2],
	},
	{
		name: 'Barliman Butterbur',
		points: 45,
		stats: [6, 3, 4, 3, 4, 1, 2, 6, 7, 2, 3, 2],
	},
	{
		name: 'The Gatekeeper of Bree',
		points: 40,
		stats: [6, 3, 5, 3, 3, 1, 2, 7, 8, 1, 3, 1],
	},
	{
		name: 'Smeagol',
		points: 30,
		stats: [5, 4, 5, 4, 4, 2, 2, 7, 6, 1, 0, 1],
	},
	{
		name: 'Treebeard',
		points: 190,
		stats: [6, 8, 3, 8, 8, 4, 4, 3, 4, 3, 4, 3],
		equipment: [
			{
				name: 'Merry & Pippin',
				points: 10,
			},
		],
	},
	{
		name: 'Beechbone',
		points: 150,
		stats: [6, 8, 4, 8, 8, 3, 4, 4, 5, 3, 1, 0],
	},
	{
		name: 'Birchseed',
		points: 150,
		stats: [6, 7, 4, 7, 8, 3, 3, 5, 5, 1, 2, 3],
	},
	{
		name: 'Ent',
		points: 100,
		stats: [6, 7, 4, 8, 8, 3, 3, 4, 5],
	},
	{
		name: 'Gwaihir',
		points: 150,
		stats: [12, 8, 4, 6, 8, 3, 3, 3, 3, 3, 3, 3],
	},
	{
		name: 'Great Eagle',
		points: 100,
		stats: [12, 7, 4, 6, 8, 2, 3, 4, 4],
	},
	{
		name: 'Fledgeling Great Eagle',
		points: 75,
		stats: [12, 6, 4, 5, 7, 2, 3, 5, 5],
	},
];

export const MESBGProfiles = Profiles.map((x) => ({
	...x,
	game: Games.MESBG,
})) as Profile[];
