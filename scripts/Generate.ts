const fs = require('fs');

interface GameData {
	name: string;
	base_points: number;
	profile_origin: string;
	unit_type: string;
	MWFW: string[][];
	options: {
		name: string;
		points: number;
	}[];
}

interface ProfileData {
	Mv: string;
	Fv: string;
	Sv: string;
	S: string;
	D: string;
	A: string;
	W: string;
	C: string;
	I: string;
}

const profileData = require('./profiles.json');
const gameData = require('./mesbg.json');

const getStats = (p: ProfileData, gameData: GameData) => {
	const base = [p.Mv, p.Fv, p.Sv, p.S, p.D, p.A, p.W, p.C, p.I].map((x) =>
		x.replace('+', '').replace('"', ''),
	);

	if (gameData.MWFW.length === 0) {
		return base;
	}

	const [m, w, f] = gameData.MWFW[0][1].split(':');

	return [...base, m, w, f];
};

(async () => {
	console.log('Generating profiles...');

	const profiles = [];

	for (const key of Object.keys(gameData)) {
		const data: GameData = gameData[key];

		const profile = profileData[data.profile_origin][data.name];

		profiles.push({
			name: data.name,
			points: data.base_points,
			game: 'MESBG',
			stats: getStats(profile, data),
			equipment: data.options.map((x) => ({ name: x.name, points: x.points })),
		});
	}

	fs.writeFileSync(
		'data/MESBGProfiles.json',
		JSON.stringify(profiles, undefined, 4),
	);

	console.log('Done');
})();
