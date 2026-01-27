import { View } from 'react-native';
import { Content } from './Content';
import { Loading } from './Loading';

interface Props {
	message: string;
}

export const LoadingScreen = ({ message }: Props) => {
	return (
		<View
			className={'flex h-full grow flex-col items-center justify-center gap-3'}
		>
			<Loading />

			<Content type={'subtitle'} size={'lg'}>
				{message}
			</Content>
		</View>
	);
};
