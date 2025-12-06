import {router} from 'expo-router';
import {View} from 'react-native';
import {Content} from '../../components';
import {NextWindowButton} from '../../components/NextWindowButton';
import {useNewListActions} from '../../states/useNewListStore';
import {GamesList} from '../../types';

export default function SelectGame() {
	const { setGame } = useNewListActions();

	return (
		<View className={'flex flex-col gap-6 p-6'}>
			<Content size={'sm'} type={'title'} center>
				Select Game
			</Content>

			{GamesList.map(({ title, value }) => (
				<NextWindowButton
					key={value}
					label={title}
					onPress={() => {
						setGame(title);
						router.dismiss();
					}}
				/>
			))}
		</View>
	);
}
