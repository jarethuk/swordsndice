import './testSetup';
import { fireEvent, render } from '@testing-library/react-native';
import { NextWindowButton } from './NextWindowButton';

describe('NextWindowButton', () => {
	it('renders label and subtitle', () => {
		const { getByText } = render(
			<NextWindowButton
				onPress={jest.fn()}
				label={'Label'}
				subtitle={'Subtitle'}
			/>,
		);
		expect(getByText('Label')).toBeTruthy();
		expect(getByText('Subtitle')).toBeTruthy();
	});

	it('does not call onPress when disabled', () => {
		const onPress = jest.fn();
		const { getByTestId } = render(
			<NextWindowButton
				onPress={onPress}
				label={'Label'}
				disabled
				testID={'next-window-button'}
			/>,
		);
		fireEvent.press(getByTestId('next-window-button'));
		expect(onPress).not.toHaveBeenCalled();
	});
});
