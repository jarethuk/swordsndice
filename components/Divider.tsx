import {View} from 'react-native';

interface Props {
	className?: string;
}

export default function Divider({ className }: Props) {
	return <View className={`h-0.5 w-full bg-gray-300 ${className}`} />;
}
