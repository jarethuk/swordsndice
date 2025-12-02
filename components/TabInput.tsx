import type {IconDefinition} from '@fortawesome/fontawesome-svg-core';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {clsx} from 'clsx';
import React from 'react';
import {Pressable, View} from 'react-native';
import {useColours} from '../hooks/useColours';
import {Content} from './Content';

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
	const colours = useColours();

	return (
		<View
			className={
				'p-2 bg-panel-light dark:bg-panel-dark rounded-2xl flex flex-row gap-4 justify-evenly'
			}
		>
			{tabs.map(({ value, title, icon }) => (
				<Pressable
					className={clsx(
						'px-4 py-2 rounded-xl grow flex flex-row gap-2 items-center justify-center',
						{
							'bg-primary-light dark:bg-primary-dark': selected === value,
						},
					)}
					key={value}
					onPress={() => onChange(value)}
				>
					{icon && (
						<FontAwesomeIcon
							icon={icon}
							size={14}
							color={selected === value ? 'white' : colours.text}
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
