import { View } from 'react-native';

interface Props {
  className?: string;
}

export default function Divider({ className }: Props) {
  return <View className={`bg-border-light dark:bg-border-dark h-0.5 w-full ${className}`} />;
}
