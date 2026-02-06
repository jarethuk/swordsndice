import { faBars } from '@awesome.me/kit-6b5fd61d92/icons/duotone/solid';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { useState } from 'react';
import { Pressable, View } from 'react-native';
import OutsidePressHandler from 'react-native-outside-press';
import { Content } from './Content';
import { FAIcon } from './FAIcon';

interface Props {
	items: {
		title: string;
		icon: IconDefinition;
		onPress: () => void;
	}[];
}

export const MenuButton = ({ items }: Props) => {
	const [open, setOpen] = useState(false);

	return (
		<View className={'relative z-20'}>
			<Pressable onPress={() => setOpen(true)} testID={'menu-button-trigger'}>
				<FAIcon icon={faBars} size={20} solid />
			</Pressable>

			{open && (
				<OutsidePressHandler onOutsidePress={() => setOpen(false)}>
					<View
						className={
							'bg-panel-light dark:bg-panel-dark absolute right-0 z-20 flex min-w-36 gap-6 rounded-2xl p-4 shadow-lg'
						}
					>
						{items.map(({ title, onPress, icon }) => (
							<Pressable
								key={title}
								className={'flex flex-row items-center gap-2'}
								onPress={() => {
									onPress();
									setOpen(false);
								}}
							>
								<FAIcon icon={icon} />

								<Content type={'subtitle'}>{title}</Content>
							</Pressable>
						))}
					</View>
				</OutsidePressHandler>
			)}
		</View>
	);
};
