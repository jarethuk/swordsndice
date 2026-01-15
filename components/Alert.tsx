import { clsx } from 'clsx';
import type { PropsWithChildren } from 'react';
import { View } from 'react-native';
import { Content } from './Content';

interface Props extends PropsWithChildren {
	type: 'success' | 'error' | 'info' | 'warning';
	className?: string;
	message?: string | null | Error;
}

export function Alert({ type, className, message }: Props) {
	if (!message) {
		return;
	}

	const classes = clsx([
		{
			'bg-info-light dark:bg-info-dark': type === 'info',
			'bg-warning-light dark:bg-warning-dark': type === 'warning',
			'bg-negative-light dark:bg-negative-dark': type === 'error',
			'bg-positive-light dark:bg-positive-dark': type === 'success',
		},
		'p-4',
		'rounded-xl',
		className,
	]);

	return (
		<View className={classes}>
			<Content type={'subtitle'} size={'md'} center>
				{typeof message === 'object' ? message.message : message}
			</Content>
		</View>
	);
}
