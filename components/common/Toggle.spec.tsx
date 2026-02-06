import './testSetup';
import { fireEvent, render } from '@testing-library/react-native';
import Toggle from './Toggle';

describe('Toggle', () => {
	it('renders', () => {
		const { toJSON } = render(<Toggle value={true} onChange={jest.fn()} />);
		expect(toJSON()).toBeTruthy();
	});

	it('calls onChange when pressed', () => {
		const onChange = jest.fn();
		const { getByTestId } = render(
			<Toggle value={false} onChange={onChange} />,
		);
		fireEvent.press(getByTestId('toggle'));
		expect(onChange).toHaveBeenCalled();
	});
});
