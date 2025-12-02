import {
    BottomSheetBackdrop,
    type BottomSheetBackdropProps,
    type BottomSheetBackgroundProps,
    BottomSheetModal,
    BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import {type PropsWithChildren, useEffect, useMemo, useRef} from 'react';
import {Dimensions, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useColours} from '../hooks/useColours';

interface Props extends PropsWithChildren {
	onDismiss: () => void;
	onBack?: () => void;
}

const CustomBackdrop = ({
	animatedIndex,
	style,
	animatedPosition,
}: BottomSheetBackdropProps) => {
	return (
		<BottomSheetBackdrop
			animatedIndex={animatedIndex}
			style={style}
			animatedPosition={animatedPosition}
			appearsOnIndex={0}
			disappearsOnIndex={-1}
			pressBehavior={'close'}
			opacity={0.3}
		/>
	);
};

const CustomBackground = ({ style }: BottomSheetBackgroundProps) => {
	const colours = useColours();

	const containerStyle = useMemo(
		() => [
			style,
			{
				backgroundColor: colours.background,
				borderTopWidth: 2,
				borderColor: colours.primary,
			},
		],
		[colours, style],
	);

	return <View pointerEvents="none" style={containerStyle} />;
};

export const Popup = ({ onDismiss, children, onBack }: Props) => {
	const ref = useRef<BottomSheetModal>(null);
	const { bottom } = useSafeAreaInsets();
	const colours = useColours();

	useEffect(() => {
		if (ref) {
			ref.current?.present();
		}
	}, [ref]);

	return (
		<BottomSheetModal
			backdropComponent={CustomBackdrop}
			ref={ref}
			keyboardBlurBehavior={'restore'}
			index={0}
			onDismiss={onDismiss}
			backgroundComponent={CustomBackground}
			maxDynamicContentSize={Dimensions.get('window').height * 0.8}
			handleIndicatorStyle={{
				backgroundColor: colours.primary,
				marginTop: 6,
			}}
			style={{
				zIndex: 1000,
				shadowColor: '#fff',
				shadowOffset: {
					width: 0,
					height: 5,
				},
				shadowOpacity: 0.34,
				shadowRadius: 6.27,
				elevation: 10,
			}}
		>
			<BottomSheetScrollView keyboardShouldPersistTaps={'handled'}>
				<View
					style={{
						marginBottom: bottom,
					}}
				>
					<View className={'px-6 pb-6 pt-2'}>{children}</View>
				</View>
			</BottomSheetScrollView>
		</BottomSheetModal>
	);
};
