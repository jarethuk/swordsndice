import { faChevronDown } from '@awesome.me/kit-6b5fd61d92/icons/duotone/solid';
import { clsx } from 'clsx';
import { type ReactElement, useState } from 'react';
import { Pressable, View } from 'react-native';
import { Container } from '../Container';
import { Content } from '../Content';
import { FAIcon } from '../FAIcon';
import { Popup } from '../Popup';
import { PopupRow } from '../PopupRow';

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

	return (
		<View className={clsx('relative', className)}>
			<Pressable
				className={'flex flex-row items-center gap-4'}
				onPress={() => setIsSelecting(true)}
			>
				<View className={'flex flex-row items-center gap-2'}>
					{icon}
					<Content size={'xs'} type={'title'}>
						{options.find((x) => x.value === selected)?.title}
					</Content>
				</View>

				<FAIcon icon={faChevronDown} />
			</Pressable>

			{isSelecting && (
				<Popup onDismiss={() => setIsSelecting(false)}>
					<Container>
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
					</Container>
				</Popup>
			)}
		</View>
	);
};
