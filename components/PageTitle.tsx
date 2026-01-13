import { faRefresh } from '@awesome.me/kit-34e2017de2/icons/duotone/solid';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Pressable, View } from 'react-native';
import { useColours } from '../hooks/useColours';
import { Content } from './Content';

interface Props {
  refetch?: () => void;
  title?: string;
  subtitle?: string;
}

export const PageTitle = ({ refetch, title, subtitle }: Props) => {
  const colours = useColours();

  if (!title) return;

  return (
    <View className={'flex gap-4'}>
      <View className={'flex flex-row items-center gap-1'}>
        <View className={'w-4'} />

        <View className={'grow'}>
          <Content size={'sm'} type={'title'} center>
            {title}
          </Content>
        </View>

        <View className={'w-4'}>
          {refetch && (
            <Pressable onPress={refetch}>
              <FontAwesomeIcon icon={faRefresh} size={16} color={colours.text} />
            </Pressable>
          )}
        </View>
      </View>

      {subtitle && (
        <Content size={'md'} type={'body'} center>
          {subtitle}
        </Content>
      )}
    </View>
  );
};
