import { faSword } from '@awesome.me/kit-34e2017de2/icons/duotone/solid';
import { router } from 'expo-router';
import { useAPILists } from '../../api/list/useAPILists';
import { Dialog } from '../../components/Dialog';
import ListRow from '../../components/ListRow';
import { LoadingScreen } from '../../components/LoadingScreen';
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
    </Dialog>
  );
}
