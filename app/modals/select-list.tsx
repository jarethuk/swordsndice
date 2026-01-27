import { faSword } from '@awesome.me/kit-6b5fd61d92/icons/duotone/solid';
import { router } from 'expo-router';
import { View } from 'react-native';
import { useAPILists } from '../../api/list/useAPILists';
import { Button } from '../../components/common/Button';
import { Dialog } from '../../components/common/Dialog';
import ListRow from '../../components/common/ListRow';
import { LoadingScreen } from '../../components/common/LoadingScreen';
import { useNewGameActions } from '../../states/useNewGameStore';

export default function SelectListModal() {
	const { setList } = useNewGameActions();
	const { data } = useAPILists();

	if (!data) {
		return <LoadingScreen message={'Loading lists...'} />;
	}

	return (
		<Dialog title={'Select List'}>
			{data.map((list) => (
				<ListRow
					key={`${list.id}`}
					title={list.name}
					image={list.image}
					right={`${list.points}pts`}
					subtitle={list.army}
					onPress={() => {
						setList(list);
						router.dismiss();
					}}
					placeHolderIcon={faSword}
				/>
			))}

			{!data.length && (
				<View className={'flex h-full items-center justify-center'}>
					<Button
						content={'Create List'}
						onPress={() => router.navigate('/(tabs)/create-list')}
					/>
				</View>
			)}
		</Dialog>
	);
}
