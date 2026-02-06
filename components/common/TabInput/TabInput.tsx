import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { clsx } from 'clsx';
import { Pressable, View } from 'react-native';
import { Content } from '../Content';
import { FAIcon } from '../FAIcon';

interface Props {
	selected: string;
	tabs: {
		title: string;
		value: string;
		icon?: IconDefinition;
	}[];
	onChange: (selected: string) => void;
}

export const TabInput = ({ tabs, selected, onChange }: Props) => {
	return (
		<View
			className={
				'bg-panel-light dark:bg-panel-dark flex flex-row justify-evenly gap-4 rounded-2xl p-2'
			}
		>
			{tabs.map(({ value, title, icon }) => (
				<Pressable
					className={clsx(
						'flex grow flex-row items-center justify-center gap-2 rounded-xl px-4 py-2',
						{
							'bg-primary-light dark:bg-primary-dark': selected === value,
						},
					)}
					key={value}
					onPress={() => onChange(value)}
				>
					{icon && (
						<FAIcon
							icon={icon}
							size={14}
							colour={selected === value ? 'white' : 'text'}
						/>
					)}

					<Content
						type={'subtitle'}
						size={'md'}
						center
						variant={selected === value ? 'white' : undefined}
					>
						{title}
					</Content>
				</Pressable>
			))}
		</View>
	);
};
