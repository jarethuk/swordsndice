import { router } from 'expo-router';
import { View } from 'react-native';
import { Content } from '../components';
import { Button } from '../components/Button';

export default function NotFoundScreen() {
  return (
    <View className={'flex grow flex-col items-center justify-center gap-6 p-12'}>
      <Content type={'title'} size={'md'}>
        Page Not Found
      </Content>

      <Button content={'Back'} onPress={() => router.back()} />
    </View>
  );
}
