import { useMemo } from 'react';
import { GamesList } from '../../../types/Enums';
import { DropDown } from '../../common/DropDown';

interface Props {
	selected?: string;
	onChange: (selected: string) => void;
}

export default function GamesDropdown({ selected, onChange }: Props) {
	const games = useMemo(() => {
		return [
			{
				title: 'All Games',
				value: '',
			},
		].concat(GamesList);
	}, []);

	return <DropDown selected={selected} options={games} onChange={onChange} />;
}
