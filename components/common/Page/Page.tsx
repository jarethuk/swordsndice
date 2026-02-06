import { clsx } from 'clsx';
import type { PropsWithChildren } from 'react';
import { Animated, RefreshControl, View } from 'react-native';
import { Container } from '../Container';

import { PageTitle } from '../PageTitle';

import ScrollView = Animated.ScrollView;

interface Props extends PropsWithChildren {
	refetch?: () => void;
	isLoading?: boolean;
	isDark?: boolean;
	title?: string;
	subtitle?: string;
}

export const Page = ({
	refetch,
	isLoading,
	children,
	isDark,
	title,
	subtitle,
}: Props) => {
	return (
		<View
			className={clsx('w-full h-full', {
				'bg-background-dark': isDark,
			})}
		>
			<Container>
				<ScrollView
					contentContainerClassName={'flex gap-6 pb-12'}
					keyboardShouldPersistTaps={'handled'}
					showsVerticalScrollIndicator={false}
					contentInsetAdjustmentBehavior={'automatic'}
					testID={'page-scroll'}
					refreshControl={
						refetch ? (
							<RefreshControl refreshing={!!isLoading} onRefresh={refetch} />
						) : undefined
					}
				>
					<PageTitle title={title} subtitle={subtitle} refetch={refetch} />

					{children}
				</ScrollView>
			</Container>
		</View>
	);
};
