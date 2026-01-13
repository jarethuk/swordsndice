import type { PropsWithChildren } from 'react';
import Animated from 'react-native-reanimated';
import { Content } from './Content';

import { View } from 'react-native';
import ScrollView = Animated.ScrollView;

interface Props extends PropsWithChildren {
  title: string;
}

export const Dialog = ({ title, children }: Props) => {
	return (
		<ScrollView
			contentContainerClassName={'flex h-full w-full gap-6 p-6 md:p-8'}
			keyboardShouldPersistTaps={'handled'}
			showsVerticalScrollIndicator={false}
			contentInsetAdjustmentBehavior={'automatic'}
		>
			<Content size={'sm'} type={'title'} center>
				{title}
			</Content>

			<View className={'flex gap-8'}>{children}</View>
		</ScrollView>
	);
};
