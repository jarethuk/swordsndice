import { type PropsWithChildren, useEffect } from 'react';
import type { ViewStyle } from 'react-native';
import Animated, {
	cancelAnimation,
	Easing,
	useAnimatedStyle,
	useSharedValue,
	withRepeat,
	withTiming,
} from 'react-native-reanimated';

interface Props extends PropsWithChildren {
	style?: ViewStyle;
}

export const Spin = ({ children, style }: Props) => {
	const rotation = useSharedValue(0);

	const spinnerStyles = useAnimatedStyle(() => {
		return {
			transform: [
				{
					rotateZ: `${rotation.value}deg`,
				},
			],
		};
	}, [rotation.value]);

	useEffect(() => {
		rotation.value = withRepeat(
			withTiming(360, {
				duration: 2000,
				easing: Easing.linear,
			}),
			200,
		);
		return () => cancelAnimation(rotation);
	}, [rotation]);

	return (
		<Animated.View
			className={'flex items-center'}
			style={[spinnerStyles, style]}
		>
			{children}
		</Animated.View>
	);
};
