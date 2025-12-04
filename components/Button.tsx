import {clsx} from 'clsx';
import type {ReactElement} from 'react';
import {Pressable, View} from 'react-native';
import {Content} from './Content';
import {Loading} from './Loading';

interface Props {
	content: string | ReactElement;
	variant?:
		| 'primary'
		| 'secondary'
		| 'positive'
		| 'negative'
		| 'outline'
		| 'light';
	onPress?: () => void;
	loading?: boolean;
	disabled?: boolean;
}

export const Button = ({
	content,
	variant,
	onPress,
	loading,
	disabled,
}: Props) => {
	return (
		<Pressable
			className={clsx('w-full rounded-2xl overflow-hidden', {
				'active:pb-0 active:mt-1 pb-1': variant !== 'outline',
				'bg-primaryShadow-light dark:bg-primaryShadow-dark':
					!disabled && (!variant || variant === 'primary'),
				'bg-secondaryShadow-light dark:bg-secondaryShadow-dark':
					variant === 'secondary',
				'border-border-light dark:border-border-dark border-2 ':
					variant === 'outline',
				'bg-panelDrop-light dark:bg-panelDrop-dark': variant === 'light',
			})}
			onPress={() => {
				if (!disabled) {
					onPress?.();
				}
			}}
		>
			<View
				className={clsx(
					'flex flex-row gap-4 py-4 px-6 items-center justify-center rounded-2xl relative overflow-hidden h-[55px]',
					{
						'bg-primary-light dark:bg-primary-dark':
							!variant || variant === 'primary',
						'bg-secondary-light dark:bg-secondary-dark':
							variant === 'secondary',
						'bg-positive-light dark:bg-positive-dark': variant === 'positive',
						'bg-negative-light dark:bg-negative-dark': variant === 'negative',
						'bg-background-light dark:bg-background-dark':
							variant === 'outline' || variant === 'light',
						'opacity-50': disabled,
					},
				)}
			>
				{loading ? (
					<Loading size={23} white />
				) : typeof content === 'string' ? (
					<Content
						type={'cta'}
						size={'lg'}
						className={'pt-1'}
						variant={
							variant === 'outline' || variant === 'light' ? undefined : 'white'
						}
					>
						{content}
					</Content>
				) : (
					content
				)}
			</View>
		</Pressable>
	);
};
