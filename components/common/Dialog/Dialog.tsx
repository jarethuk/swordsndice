import type { PropsWithChildren } from 'react';
import { View } from 'react-native';
import Animated from 'react-native-reanimated';
import { Content } from '../Content';

import ScrollView = Animated.ScrollView;

interface Props extends PropsWithChildren {
	title: string;
	subtitle?: string;
}

export const Dialog = ({ title, children, subtitle }: Props) => {
	return (
		<ScrollView
			contentContainerClassName={'flex w-full gap-6 p-6 md:p-8'}
			keyboardShouldPersistTaps={'handled'}
			showsVerticalScrollIndicator={false}
			contentInsetAdjustmentBehavior={'automatic'}
		>
			<View className={'flex gap-2'}>
				<Content size={'sm'} type={'title'} center>
					{title}
				</Content>

				{!!subtitle && (
					<Content size={'sm'} type={'body'} center>
						{subtitle}
					</Content>
				)}
			</View>

			<View className={'flex gap-8'}>{children}</View>
		</ScrollView>
	);
};
