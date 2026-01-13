import { router } from 'expo-router';
import type { PropsWithChildren } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';
import { Content } from './Content';
import ScrollView = Animated.ScrollView;

interface Props extends PropsWithChildren {
  title: string;
}

export const Dialog = ({ title, children }: Props) => {
	return (
		<Animated.View
			entering={FadeIn}
			className={'flex h-full w-full items-center justify-center bg-black/50'}
		>
			<Pressable
				style={StyleSheet.absoluteFill}
				onPress={() => router.dismiss()}
			/>

			<Animated.View
				entering={SlideInDown}
				className={
					'max-w-lg max-h-lg bg-background-light dark:bg-background-dark rounded-2xl shadow-lg flex flex-col items-center justify-center overflow-hidden'
				}
			>
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
			</Animated.View>
		</Animated.View>
	);
};
