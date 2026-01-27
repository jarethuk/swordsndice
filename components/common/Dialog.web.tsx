import { router } from 'expo-router';
import type { PropsWithChildren } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';
import { useTheme } from '../../states/useThemeStore';
import { Content } from './Content';

import ScrollView = Animated.ScrollView;

interface Props extends PropsWithChildren {
	title: string;
	subtitle?: string;
}

export const Dialog = ({ title, children, subtitle }: Props) => {
	const theme = useTheme();

	return (
		<Animated.View
			entering={FadeIn}
			className={`${theme === 'dark' ? 'dark' : 'light'} flex h-full w-full items-center justify-center bg-black/50 fixed p-8`}
		>
			<Pressable
				style={StyleSheet.absoluteFill}
				onPress={() => router.dismiss()}
			/>

			<Animated.View
				entering={SlideInDown}
				className={
					'max-h-full bg-background-light dark:bg-background-dark w-full max-w-lg rounded-2xl shadow-lg8'
				}
			>
				<ScrollView
					contentContainerClassName={'flex h-full w-full gap-6 p-6 md:p-8'}
					keyboardShouldPersistTaps={'handled'}
					showsVerticalScrollIndicator={false}
					contentInsetAdjustmentBehavior={'automatic'}
				>
					<View className={'flex gap-2'}>
						<Content size={'sm'} type={'title'} center>
							{title}
						</Content>

						{!!subtitle && (
							<Content size={'md'} type={'body'} center>
								{subtitle}
							</Content>
						)}
					</View>

					<View className={'flex gap-8'}>{children}</View>
				</ScrollView>
			</Animated.View>
		</Animated.View>
	);
};
