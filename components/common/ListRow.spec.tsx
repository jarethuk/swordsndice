import './testSetup';
import { fireEvent, render } from '@testing-library/react-native';
import { Text } from 'react-native';
import ListRow from './ListRow';

describe('ListRow', () => {
	it('renders title and subtitle', () => {
		const { getByText } = render(
			<ListRow
				title={'Title'}
				subtitle={'Subtitle'}
				right={'10pts'}
				placeHolderIcon={{} as any}
			/>,
		);
		expect(getByText('Title')).toBeTruthy();
		expect(getByText('Subtitle')).toBeTruthy();
		expect(getByText('10pts')).toBeTruthy();
	});

	it('renders element subtitle and handles press', () => {
		const onPress = jest.fn();
		const { getByText } = render(
			<ListRow
				title={'Title'}
				subtitle={<Text>Custom</Text>}
				placeHolderIcon={{} as any}
				onPress={onPress}
			/>,
		);
		fireEvent.press(getByText('Title'));
		expect(getByText('Custom')).toBeTruthy();
		expect(onPress).toHaveBeenCalled();
	});
});
