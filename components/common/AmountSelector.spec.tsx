import './testSetup';
import { fireEvent, render } from '@testing-library/react-native';
import AmountSelector from './AmountSelector';

describe('AmountSelector', () => {
	it('renders value and max', () => {
		const { getByText } = render(
			<AmountSelector value={2} max={5} onChange={jest.fn()} />,
		);
		expect(getByText('2')).toBeTruthy();
		expect(getByText('Max 5')).toBeTruthy();
	});

	it('increments value when plus is pressed', () => {
		const onChange = jest.fn();
		const { getByTestId } = render(
			<AmountSelector value={2} max={5} onChange={onChange} />,
		);
		fireEvent.press(getByTestId('amount-selector-plus'));

		expect(onChange).toHaveBeenCalledWith(3);
	});

	it('decrements value when minus is pressed', () => {
		const onChange = jest.fn();
		const { getByTestId } = render(
			<AmountSelector value={3} max={5} onChange={onChange} />,
		);
		fireEvent.press(getByTestId('amount-selector-minus'));

		expect(onChange).toHaveBeenCalledWith(2);
	});

	it('does not go below the minimum', () => {
		const onChange = jest.fn();
		const { getByTestId } = render(
			<AmountSelector value={1} max={5} onChange={onChange} />,
		);
		fireEvent.press(getByTestId('amount-selector-minus'));

		expect(onChange).not.toHaveBeenCalled();
	});

	it('does not go above the maximum', () => {
		const onChange = jest.fn();
		const { getByTestId } = render(
			<AmountSelector value={5} max={5} onChange={onChange} />,
		);
		fireEvent.press(getByTestId('amount-selector-plus'));

		expect(onChange).not.toHaveBeenCalled();
	});
});
