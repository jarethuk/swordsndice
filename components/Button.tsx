import { clsx } from 'clsx';
import { type ReactElement, useMemo } from 'react';
import { Pressable, View } from 'react-native';
import { Content } from './Content';
import { Loading } from './Loading';

interface Props {
  content: string | ReactElement;
  variant?: 'primary' | 'secondary' | 'positive' | 'negative' | 'outline' | 'light';
  onPress?: () => void;
  loading?: boolean;
  disabled?: boolean;
  isSmall?: boolean;
  themeOverride?: 'light' | 'dark';
}

export const Button = ({ content, variant, onPress, loading, disabled, themeOverride }: Props) => {
  const containerClasses = useMemo(() => {
    if (themeOverride) {
      switch (variant) {
        case 'secondary':
          return `bg-secondaryShadow-${themeOverride}`;
        case 'outline':
          return `border-border-${themeOverride} border-2`;
        case 'light':
          return `bg-panelDrop-${themeOverride}`;
        default:
          return `bg-primaryShadow-${themeOverride}`;
      }
    }

    switch (variant) {
      case 'secondary':
        return `bg-secondaryShadow-light dark:bg-secondaryShadow-dark`;
      case 'outline':
        return `border-border-light dark:border-border-dark border-2`;
      case 'light':
        return `bg-panelDrop-light dark:bg-panelDrop-dark`;
      default:
        return `bg-primaryShadow-light dark:bg-primaryShadow-dark`;
    }
  }, [themeOverride, variant]);

  const innerClasses = useMemo(() => {
    if (themeOverride) {
      switch (variant) {
        case 'secondary':
          return `bg-secondary-${themeOverride}`;
        case 'positive':
          return `bg-positive-${themeOverride}`;
        case 'negative':
          return `bg-negative-${themeOverride}`;
        case 'outline':
        case 'light':
          return `bg-background-${themeOverride}`;
        default:
          return `bg-primary-${themeOverride}`;
      }
    }

    switch (variant) {
      case 'secondary':
        return `bg-secondary-light dark:bg-secondary-dark`;
      case 'positive':
        return `bg-positive-light dark:bg-positive-dark`;
      case 'negative':
        return `bg-negative-light dark:bg-negative-dark`;
      case 'outline':
      case 'light':
        return `bg-background-light dark:bg-background-dark`;
      default:
        return `bg-primary-light dark:bg-primary-dark`;
    }
  }, [themeOverride, variant]);

  return (
    <Pressable
      className={clsx('w-full overflow-hidden rounded-2xl', containerClasses, {
        'pb-1 active:mt-1 active:pb-0': variant !== 'outline',
      })}
      onPress={() => {
        if (!disabled) {
          onPress?.();
        }
      }}>
      <View
        className={clsx(
          'relative flex h-[55px] flex-row items-center justify-center gap-4 overflow-hidden rounded-2xl px-6 py-4',
          innerClasses,
          {
            'opacity-50': disabled,
          }
        )}>
        {loading ? (
          <Loading size={23} white />
        ) : typeof content === 'string' ? (
          <Content
            type={'cta'}
            size={'lg'}
            variant={variant === 'outline' || variant === 'light' ? undefined : 'white'}
            themeOverride={themeOverride}>
            {content}
          </Content>
        ) : (
          content
        )}
      </View>
    </Pressable>
  );
};
