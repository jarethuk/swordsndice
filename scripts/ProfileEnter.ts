import * as fs from 'node:fs';
import * as readline from 'node:readline';
import type {Equipment, Profile} from '../types/Profile';

const getLine = (): Promise<string> => {
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});

	return new Promise((resolve) => {
		rl.question('', (answer) => {
			rl.close();
			resolve(answer);
		});
	});
};

const getEquipment = async () => {
	const equipment = [];
	let more = true;

	do {
		const item = {} as Equipment;
		console.log('Equipment name');
		item.name = await getLine();

		console.log('Equipment Points');
		item.points = Number(await getLine());

		equipment.push(item);

		console.log('More? (y/n)');
		more = (await getLine()) === 'y';
	} while (more);

	return equipment;
};

(async () => {
	const profiles = [];
	let more = true;

	do {
		const profile = {} as Profile;

		console.log('Name');
		profile.name = await getLine();

		console.log('Points');
		profile.points = Number(await getLine());

		console.log('Stats');
		const stats = await getLine();
		profile.stats = stats.split(' ').map(Number);

		console.log('Has equipment? (y/n)');
		const hasEquipment = (await getLine()) === 'y';

		if (hasEquipment) {
			profile.equipment = await getEquipment();
		}

		profiles.push(profile);
		console.log('Add another? (y/n)');
		more = (await getLine()) === 'y';
	} while (more);

	fs.writeFileSync('profiles.json', JSON.stringify(profiles));
})();
