import '../testSetup';
import { fireEvent, render } from '@testing-library/react-native';
import { PopupRow } from './PopupRow';

describe('PopupRow', () => {
	it('renders title', () => {
		const { getByText } = render(
			<PopupRow title={'Row'} onPress={jest.fn()} />,
		);
		expect(getByText('Row')).toBeTruthy();
	});

	it('triggers onPress', () => {
		const onPress = jest.fn();
		const { getByText } = render(<PopupRow title={'Row'} onPress={onPress} />);
		fireEvent.press(getByText('Row'));
		expect(onPress).toHaveBeenCalled();
	});
});
