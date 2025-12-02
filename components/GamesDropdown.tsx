import {useMemo} from 'react';
import {Games} from '../types';
import {DropDown} from './DropDown';

interface Props {
	selected?: string;
	onChange: (selected?: string) => void;
}

export default function GamesDropdown({ selected, onChange }: Props) {
	const games = useMemo(() => {
		return Object.values(Games).map((value) => ({ title: value, value }));
	}, []);

	return <DropDown selected={selected} options={games} onChange={onChange} />;
}
