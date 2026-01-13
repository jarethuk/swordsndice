import { clsx } from 'clsx';
import type { PropsWithChildren } from 'react';
import { Animated, RefreshControl, View } from 'react-native';
import { useColours } from '../hooks/useColours';

import { Container } from './Container';
import ScrollView = Animated.ScrollView;

interface Props extends PropsWithChildren {
  refetch?: () => void;
  isLoading?: boolean;
  isDark?: boolean;
}

export const Page = ({ refetch, isLoading, children, isDark }: Props) => {
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
					{children}
				</ScrollView>
			</Container>
		</View>
	);
};
