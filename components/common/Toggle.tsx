import { clsx } from 'clsx';
import { Pressable, View } from 'react-native';

interface Props {
	className?: string;
	value: boolean;
	onChange?: () => void;
}

export default function Toggle({ className, value, onChange }: Props) {
	return (
		<Pressable
			onPress={onChange}
			className={clsx('w-16 h-9 rounded-full p-1', className, {
				'bg-gray-300 dark:bg-panel-dark': !value,
				'bg-purple-500': value,
			})}
		>
			<View
				className={`w-7 h-7 rounded-full bg-white ${value ? 'translate-x-7' : ''}`}
			/>
		</Pressable>
	);
}
