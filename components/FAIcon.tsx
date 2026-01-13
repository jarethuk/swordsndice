import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useColours } from '../hooks/useColours';

interface Props {
  icon: IconDefinition;
  size?: number;
  colour?: 'text' | 'primary' | 'secondary' | 'white';
}

export const FAIcon = ({ icon, size = 16, colour = 'text' }: Props) => {
  const colours = useColours();

  return (
    <FontAwesomeIcon
      icon={icon}
      size={size}
      color={colour === 'white' ? 'white' : colours[colour]}
    />
  );
};
