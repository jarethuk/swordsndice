import {faMinus, faPlus,} from '@awesome.me/kit-34e2017de2/icons/duotone/solid';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {useCallback} from 'react';
import {View} from 'react-native';
import {useColours} from '../hooks/useColours';
import {Button} from './Button';
import {Content} from './Content';

interface Props {
	value: number;
	onChange: (value: number) => void;
	max: number;
}

export default function AmountSelector({ value, onChange, max }: Props) {
	const colours = useColours();
	const canMinus = value > 1;
	const canAdd = value < max;

	const add = useCallback(() => onChange(value + 1), [value, onChange]);
	const minus = useCallback(() => onChange(value - 1), [value, onChange]);

	return (
		<View className={'flex'}>
			<View className={'flex flex-row items-center gap-4'}>
				<View>
					<Button
						content={<FontAwesomeIcon icon={faMinus} color={colours.text} />}
						onPress={minus}
						disabled={!canMinus}
						variant={'light'}
					/>
				</View>

				<View className={'grow'}>
					<Content size={'md'} type={'subtitle'} center>
						{value}
					</Content>
				</View>

				<View>
					<Button
						content={<FontAwesomeIcon icon={faPlus} color={colours.text} />}
						onPress={add}
						disabled={!canAdd}
						variant={'light'}
					/>
				</View>
			</View>

			<Content size={'sm'} type={'subtitle'} center muted>
				Max {max}
			</Content>
		</View>
	);
}
