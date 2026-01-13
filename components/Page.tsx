import { clsx } from 'clsx';
import type { PropsWithChildren } from 'react';
import { Animated, RefreshControl, View } from 'react-native';
import { useColours } from '../hooks/useColours';
import { Container } from './Container';

import { PageTitle } from './PageTitle';
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
	const colours = useColours();

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
					refreshControl={
						refetch ? (
							<RefreshControl
								refreshing={!!isLoading}
								onRefresh={refetch}
								colors={[colours.primary]}
							/>
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
