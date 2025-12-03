import { useEffect, useState } from 'react';
import { Database } from '../db/Database';

export const useDatabase = () => {
	const [loaded, setLoaded] = useState(false);

	useEffect(() => {
		(async () => {
			await Database.init();
			setLoaded(true);
		})();
	}, []);

	return {
		loaded,
	};
};
