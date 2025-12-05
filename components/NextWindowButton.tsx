import {faChevronRight} from '@awesome.me/kit-34e2017de2/icons/duotone/solid';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {clsx} from 'clsx';
import React, {type ReactElement} from 'react';
import {Pressable, View} from 'react-native';
import {useColours} from '../hooks/useColours';
import {Content} from './Content';

interface Props {
	onPress: () => void;
	label: ReactElement | string;
	subtitle?: ReactElement | string;
	iconStart?: ReactElement;
	bottom?: ReactElement;
	disabled?: boolean;
}

export const NextWindowButton = ({
	subtitle,
	iconStart,
	onPress,
	label,
	bottom,
	disabled,
}: Props) => {
	const colours = useColours();

	return (
		<Pressable
			onPress={disabled ? undefined : onPress}
			className={clsx({
				'opacity-50': disabled,
				'bg-primary-light dark:bg-primary-dark rounded-2xl': bottom,
			})}
		>
			<View
				className={
					'border-2 border-border-light dark:border-border-dark dark:border-panel-dark rounded-2xl w-full flex flex-row gap-4 items-center px-4 py-2 bg-background-light dark:bg-background-dark'
				}
			>
				{iconStart}

				<View className={'relative w-full shrink group flex gap-4'}>
					{label &&
						(typeof label === 'string' ? (
							<Content type={'subtitle'} size={'md'}>
								{label}
							</Content>
						) : (
							label
						))}

					{subtitle &&
						(typeof subtitle === 'string' ? (
							<Content type={'subtitle'} size={'md'} className={'top-[26px]'}>
								{subtitle}
							</Content>
						) : (
							subtitle
						))}
				</View>

				<FontAwesomeIcon icon={faChevronRight} size={16} color={colours.text} />
			</View>

			{bottom && <View className={'pt-1 pb-2 px-5'}>{bottom}</View>}
		</Pressable>
	);
};
