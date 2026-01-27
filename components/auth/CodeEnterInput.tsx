import type React from 'react';
import { useRef, useState } from 'react';
import { TextInput, View } from 'react-native';

interface Props {
	length: number;
	onComplete: (code: string) => void;
}

export const CodeEnterInput: React.FC<Props> = ({ length, onComplete }) => {
	const [code, setCode] = useState<string[]>(new Array(length).fill(''));
	const inputRefs = useRef<TextInput[]>([]);

	const handleChange = (text: string, index: number) => {
		if (!/^\d*$/.test(text)) return;

		if (text.length > 1) {
			const digits = text.split('');
			const paddedDigits = [
				...digits.slice(0, length),
				...new Array(Math.max(0, length - digits.length)).fill(''),
			];
			setCode(paddedDigits);

			inputRefs.current[digits.length - 1]?.focus();

			if (digits.length === length) {
				onComplete(digits.join(''));
			}
		} else {
			const newCode = [...code];
			newCode[index] = text;
			setCode(newCode);

			if (text.length === 1 && index < length - 1) {
				inputRefs.current[index + 1]?.focus();
			}

			if (newCode.every((digit) => digit !== '')) {
				onComplete(newCode.join(''));
			}
		}
	};

	const handleKeyPress = (event: any, index: number) => {
		if (event.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
			inputRefs.current[index - 1]?.focus();
		}
	};

	return (
		<View className="flex-row justify-center gap-2">
			{code.map((digit, index) => (
				<TextInput
					key={index.toString()}
					ref={(ref) => {
						if (ref) inputRefs.current[index] = ref;
					}}
					className="border-border-dark bg-background-dark h-16 w-16 rounded-2xl border-2 text-[16px] text-white"
					style={{
						textAlign: 'center',
					}}
					keyboardType="numeric"
					value={digit}
					onChangeText={(text) => handleChange(text, index)}
					onKeyPress={(e) => handleKeyPress(e, index)}
					selectTextOnFocus
					textContentType={'oneTimeCode'}
				/>
			))}
		</View>
	);
};
