import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { clsx } from 'clsx';
import { type ReactElement, useRef, useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';
import { Content } from './Content';

interface Props {
	value: string;
	onChange: (value: string) => void;
	label?: string;
	type: 'text' | 'numeric' | 'search' | 'decimal';
	iconStart?: ReactElement;
	iconEnd?: ReactElement;
	isBottomSheet?: boolean;
	placeholder?: string;
	error?: string;
	bottom?: ReactElement;
	secret?: boolean;
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
}: Props) => {
	const [hasFocus, setHasFocus] = useState(false);
	const moveLabel = hasFocus || !!value;
	const ref = useRef<any>(null);

	const inputProps = {
		ref,
		className: clsx(
			'w-full shrink text-text-light dark:text-text-dark placeholder:text-[#8A8397] text-[16px] focus:outline-none',
			{
				'h-0 overflow-hidden': label && !moveLabel,
				// 'top-[22px]': label && !moveLabel,
				'h-[60px]': !label,
			},
		),
		value: value,
		onChangeText: onChange,
		inputMode: type,
		onFocus: () => setHasFocus(true),
		onBlur: () => setHasFocus(false),
		placeholder,
		style: { fontFamily: 'DINRoundPro' },
		secureTextEntry: secret,
	};

	return (
		<View className={'flex flex-col w-full gap-2'}>
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
					className={
						'border-2 border-border-light dark:border-border-dark rounded-2xl w-full flex flex-row gap-4 items-center px-4 bg-background-light dark:bg-background-dark h-[60px]'
					}
				>
					{iconStart}

					<View
						className={clsx('w-full shrink group flex flex-col', {
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
								autoCapitalize={'none'}
								autoCorrect={false}
							/>
						)}
					</View>

					{iconEnd}
				</View>

				{bottom && <View className={'pt-1 pb-2 px-5'}>{bottom}</View>}
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
