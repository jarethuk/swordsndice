import '../testSetup';
import { fireEvent, render } from '@testing-library/react-native';
import { Text } from 'react-native';
import { Button } from './Button';

describe('Button', () => {
	it('renders content', () => {
		const { getByText } = render(<Button content={'Tap'} />);
		expect(getByText('Tap')).toBeTruthy();
	});

	it('renders element content', () => {
		const { getByText } = render(<Button content={<Text>Custom</Text>} />);
		expect(getByText('Custom')).toBeTruthy();
	});

	it('calls onPress when enabled', () => {
		const onPress = jest.fn();
		const { getByText } = render(<Button content={'Tap'} onPress={onPress} />);
		fireEvent.press(getByText('Tap'));
		expect(onPress).toHaveBeenCalled();
	});

	it('does not call onPress when disabled', () => {
		const onPress = jest.fn();
		const { getByText } = render(
			<Button content={'Tap'} onPress={onPress} disabled />,
		);
		fireEvent.press(getByText('Tap'));
		expect(onPress).not.toHaveBeenCalled();
	});
});
