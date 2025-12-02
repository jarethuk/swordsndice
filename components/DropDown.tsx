import {faChevronDown} from '@awesome.me/kit-34e2017de2/icons/duotone/solid';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {clsx} from 'clsx';
import React, {type ReactElement, useState} from 'react';
import {Pressable, View} from 'react-native';
import {useColours} from '../hooks/useColours';
import {Content} from './Content';
import {Popup} from './Popup';
import {PopupRow} from './PopupRow';

export interface DropDownOption {
	title: string;
	value: string;
	icon?: ReactElement;
}

interface Props {
	title?: string;
	selected?: string;
	options: DropDownOption[];
	onChange: (value: string) => void;
	className?: string;
	icon?: ReactElement;
}

export const DropDown = ({
	onChange,
	selected,
	options,
	className,
	icon,
	title,
}: Props) => {
	const [isSelecting, setIsSelecting] = useState(false);
	const colours = useColours();

	return (
		<View className={clsx('relative', className)}>
			<Pressable
				className={'flex flex-row gap-4 items-center'}
				onPress={() => setIsSelecting(true)}
			>
				<View className={'flex flex-row gap-2 items-center'}>
					{icon}
					<Content size={'xs'} type={'title'}>
						{options.find((x) => x.value === selected)?.title}
					</Content>
				</View>

				<FontAwesomeIcon icon={faChevronDown} size={16} color={colours.text} />
			</Pressable>

			{isSelecting && (
				<Popup onDismiss={() => setIsSelecting(false)}>
					<View className={'flex flex-col gap-4'}>
						{!!title && (
							<Content type={'subtitle'} size={'md'}>
								{title}
							</Content>
						)}

						{options.map(({ title, value, icon }) => (
							<PopupRow
								onPress={() => {
									onChange(value);
									setIsSelecting(false);
								}}
								key={value}
								title={title}
								icon={icon}
							/>
						))}
					</View>
				</Popup>
			)}
		</View>
	);
};
