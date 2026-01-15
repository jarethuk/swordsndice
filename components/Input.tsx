import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { clsx } from 'clsx';
import { type ReactElement, useMemo, useRef, useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';
import { Content } from './Content';

interface Props {
	value: string;
	onChange: (value: string) => void;
	label?: string;
	type: 'text' | 'numeric' | 'search' | 'decimal' | 'email';
	iconStart?: ReactElement;
	iconEnd?: ReactElement;
	isBottomSheet?: boolean;
	placeholder?: string;
	error?: string;
	bottom?: ReactElement;
	secret?: boolean;
	multiline?: boolean;
	themeOverride?: 'light' | 'dark';
	onBlur?: () => void;
	textContentType?: 'none' | 'emailAddress' | 'oneTimeCode';
}

export const Input = ({
	onChange,
	value,
	label,
	type,
	iconStart,
	iconEnd,
	isBottomSheet,
	placeholder,
	error,
	secret,
	bottom,
	multiline,
	themeOverride,
	onBlur,
	textContentType,
}: Props) => {
	const [hasFocus, setHasFocus] = useState(false);
	const moveLabel = hasFocus || !!value;
	const ref = useRef<any>(null);

	const overrideTextColour = themeOverride ? `text-text-${themeOverride}` : '';

	const inputProps = {
		ref,
		className: clsx(
			'w-full shrink placeholder:text-[#8A8397] text-[16px] focus:outline-none',
			overrideTextColour,
			{
				'h-0 overflow-hidden': label && !moveLabel,
				'top-[22px]': label && !moveLabel,
				'h-[60px]': !label && !multiline,
				'h-[100px]': multiline,
				'text-text-light dark:text-text-dark': !themeOverride,
			},
		),
		value: value,
		onChangeText: onChange,
		inputMode: type,
		textContentType,
		onFocus: () => setHasFocus(true),
		onBlur: () => {
			setHasFocus(false);
			onBlur?.();
		},
		placeholder,
		style: { fontFamily: 'DINRoundPro' },
		secureTextEntry: secret,
		multiline,
	};

	const colourClasses = useMemo(() => {
		if (themeOverride) {
			return `border-border-${themeOverride} bg-background-${themeOverride}`;
		}

		return 'border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark';
	}, [themeOverride]);

	return (
		<View className={'flex w-full flex-col gap-2'}>
			<Pressable
				onPress={() => {
					setHasFocus(true);
					ref.current?.focus();
				}}
				className={
					bottom ? 'bg-primary-light dark:bg-primary-dark rounded-2xl' : ''
				}
			>
				<View
					className={clsx(
						'flex w-full flex-row items-center gap-4 rounded-2xl border-2 px-4',
						colourClasses,
						{
							'h-[60px]': !multiline,
							'h-[160px]': multiline,
						},
					)}
				>
					{iconStart}

					<View
						className={clsx('group flex w-full shrink flex-col', {
							'gap-1': moveLabel,
						})}
					>
						{label && (
							<Content
								type={'subtitle'}
								size={moveLabel ? 'sm' : 'md'}
								muted
								lineHeightOverride={1}
							>
								{label}
							</Content>
						)}

						{isBottomSheet ? (
							<BottomSheetTextInput {...inputProps} />
						) : (
							<TextInput
								{...inputProps}
								autoCapitalize={'sentences'}
								autoCorrect={false}
								numberOfLines={multiline ? 5 : 1}
							/>
						)}
					</View>

					{iconEnd}
				</View>

				{bottom && <View className={'px-5 pt-1 pb-2'}>{bottom}</View>}
			</Pressable>

			{error && (
				<View className={'ml-4'}>
					<Content type={'note'} variant={'negative'} size={'sm'}>
						{error}
					</Content>
				</View>
			)}
		</View>
	);
};
