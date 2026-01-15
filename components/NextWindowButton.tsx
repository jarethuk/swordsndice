import { faChevronRight } from '@awesome.me/kit-34e2017de2/icons/duotone/solid';
import { clsx } from 'clsx';
import type { ReactElement } from 'react';
import { Pressable, View } from 'react-native';
import { Content } from './Content';
import { FAIcon } from './FAIcon';

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
					'border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark flex min-h-[60px] w-full flex-row items-center gap-4 rounded-2xl border-2 px-4 py-4'
				}
			>
				{iconStart}

				<View className={'group relative flex w-full shrink'}>
					{label &&
						(typeof label === 'string' ? (
							<Content type={'title'} size={'xs'}>
								{label}
							</Content>
						) : (
							label
						))}

					{subtitle &&
						(typeof subtitle === 'string' ? (
							<Content type={'subtitle'} size={'md'} muted>
								{subtitle}
							</Content>
						) : (
							subtitle
						))}
				</View>

				<FAIcon icon={faChevronRight} />
			</View>

			{bottom && <View className={'px-5 pt-1 pb-2'}>{bottom}</View>}
		</Pressable>
	);
};
