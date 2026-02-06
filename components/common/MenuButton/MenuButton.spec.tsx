import '../testSetup';
import { fireEvent, render } from '@testing-library/react-native';
import { MenuButton } from './MenuButton';

describe('MenuButton', () => {
	it('opens menu and triggers item', () => {
		const onPress = jest.fn();
		const { getByText, getByTestId, queryByText } = render(
			<MenuButton items={[{ title: 'Edit', icon: {} as any, onPress }]} />,
		);
		fireEvent.press(getByTestId('menu-button-trigger'));
		expect(getByText('Edit')).toBeTruthy();

		fireEvent.press(getByText('Edit'));
		expect(onPress).toHaveBeenCalled();
		expect(queryByText('Edit')).toBeNull();
	});
});
