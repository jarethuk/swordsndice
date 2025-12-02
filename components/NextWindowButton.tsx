import {faChevronRight} from '@awesome.me/kit-34e2017de2/icons/duotone/solid';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {clsx} from 'clsx';
import React, {type ReactElement} from 'react';
import {Pressable, View} from 'react-native';
import {useColours} from '../hooks/useColours';
import {Content} from './Content';

interface Props {
	onPress: () => void;
	label: string;
	value?: string;
	iconStart?: ReactElement;
	bottom?: ReactElement;
}

export const NextWindowButton = ({
	value,
	iconStart,
	onPress,
	label,
	bottom,
}: Props) => {
	const colours = useColours();

	return (
		<Pressable
			onPress={onPress}
			className={
				bottom ? 'bg-primary-light dark:bg-primary-dark rounded-2xl' : ''
			}
		>
			<View
				className={
					'border-2 border-border-light dark:border-border-dark dark:border-panel-dark rounded-2xl h-[60px] w-full flex flex-row gap-4 items-center px-4 bg-background-light dark:bg-background-dark'
				}
			>
				{iconStart}

				<View className={'relative h-16 w-full shrink group'}>
					{label && (
						<View
							className={clsx('absolute left-0 w-full', {
								'top-2': value,
								'top-5': !value,
							})}
						>
							<Content
								type={'subtitle'}
								size={value ? 'sm' : 'md'}
								muted={!!value}
							>
								{label}
							</Content>
						</View>
					)}

					{value && (
						<Content type={'subtitle'} size={'md'} className={'top-[26px]'}>
							{value}
						</Content>
					)}
				</View>

				<FontAwesomeIcon icon={faChevronRight} size={16} color={colours.text} />
			</View>

			{bottom && <View className={'pt-1 pb-2 px-5'}>{bottom}</View>}
		</Pressable>
	);
};
