import type { PropsWithChildren } from 'react';
import { View } from 'react-native';

export const Container = ({ children }: PropsWithChildren) => (
  <View className={'mx-auto flex h-full w-full max-w-lg gap-6'}>{children}</View>
);
