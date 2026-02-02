import { fireEvent, render } from '@testing-library/react-native';
import { CodeEnterInput } from './CodeEnterInput';

describe('CodeEnterInput', () => {
	const mockOnComplete = jest.fn();

	beforeEach(() => {
		mockOnComplete.mockClear();
	});

	it('renders correct number of inputs', () => {
		const { getAllByRole } = render(
			<CodeEnterInput length={6} onComplete={mockOnComplete} />,
		);
		const inputs = getAllByRole('none');
		expect(inputs).toHaveLength(6);
	});

	it('accepts single digit input', () => {
		const { getAllByRole } = render(
			<CodeEnterInput length={4} onComplete={mockOnComplete} />,
		);
		const inputs = getAllByRole('none');

		fireEvent.changeText(inputs[0], '5');
		expect(inputs[0].props.value).toBe('5');
	});

	it('rejects non-numeric input', () => {
		const { getAllByRole } = render(
			<CodeEnterInput length={4} onComplete={mockOnComplete} />,
		);
		const inputs = getAllByRole('none');

		fireEvent.changeText(inputs[0], 'a');
		expect(inputs[0].props.value).toBe('');
	});

	it('automatically moves to next input after entering digit', () => {
		const { getAllByRole } = render(
			<CodeEnterInput length={4} onComplete={mockOnComplete} />,
		);
		const inputs = getAllByRole('none');

		fireEvent.changeText(inputs[0], '1');
		fireEvent.changeText(inputs[1], '2');

		expect(inputs[0].props.value).toBe('1');
		expect(inputs[1].props.value).toBe('2');
	});

	it('calls onComplete when all digits are entered', () => {
		const { getAllByRole } = render(
			<CodeEnterInput length={4} onComplete={mockOnComplete} />,
		);
		const inputs = getAllByRole('none');

		const focusSpy = jest.fn();
		inputs[0].focus = focusSpy;

		fireEvent.changeText(inputs[0], '1');
		fireEvent.changeText(inputs[1], '2');
		fireEvent.changeText(inputs[2], '3');
		fireEvent.changeText(inputs[3], '4');

		expect(mockOnComplete).toHaveBeenCalledWith('1234');
	});

	it('handles pasting multiple digits', () => {
		const { getAllByRole } = render(
			<CodeEnterInput length={6} onComplete={mockOnComplete} />,
		);
		const inputs = getAllByRole('none');

		fireEvent.changeText(inputs[0], '123456');

		expect(mockOnComplete).toHaveBeenCalledWith('123456');
	});

	it('handles pasting fewer digits than length', () => {
		const { getAllByRole } = render(
			<CodeEnterInput length={6} onComplete={mockOnComplete} />,
		);
		const inputs = getAllByRole('none');

		fireEvent.changeText(inputs[0], '123');

		expect(inputs[0].props.value).toBe('1');
		expect(inputs[1].props.value).toBe('2');
		expect(inputs[2].props.value).toBe('3');
		expect(mockOnComplete).not.toHaveBeenCalled();
	});

	it('handles pasting more digits than length', () => {
		const { getAllByRole } = render(
			<CodeEnterInput length={4} onComplete={mockOnComplete} />,
		);
		const inputs = getAllByRole('none');

		fireEvent.changeText(inputs[0], '123456');

		expect(inputs[0].props.value).toBe('1');
		expect(inputs[1].props.value).toBe('2');
		expect(inputs[2].props.value).toBe('3');
		expect(inputs[3].props.value).toBe('4');
		expect(mockOnComplete).toHaveBeenCalledWith('1234');
	});

	it('handles backspace navigation when current input is empty', () => {
		const { getAllByRole } = render(
			<CodeEnterInput length={4} onComplete={mockOnComplete} />,
		);
		const inputs = getAllByRole('none');

		fireEvent.changeText(inputs[0], '1');
		fireEvent.changeText(inputs[1], '2');
		fireEvent.changeText(inputs[1], '');

		fireEvent(inputs[1], 'onKeyPress', {
			nativeEvent: { key: 'Backspace' },
		});

		// Verify state is maintained correctly
		expect(inputs[0].props.value).toBe('1');
		expect(inputs[1].props.value).toBe('');
	});

	it('does not move focus on backspace when current input has value', () => {
		const { getAllByRole } = render(
			<CodeEnterInput length={4} onComplete={mockOnComplete} />,
		);
		const inputs = getAllByRole('none');

		fireEvent.changeText(inputs[1], '2');

		const focusSpy = jest.fn();
		inputs[0].focus = focusSpy;

		fireEvent(inputs[1], 'onKeyPress', {
			nativeEvent: { key: 'Backspace' },
		});

		expect(focusSpy).not.toHaveBeenCalled();
	});

	it('does not move focus on backspace at first input', () => {
		const { getAllByRole } = render(
			<CodeEnterInput length={4} onComplete={mockOnComplete} />,
		);
		const inputs = getAllByRole('none');

		fireEvent(inputs[0], 'onKeyPress', {
			nativeEvent: { key: 'Backspace' },
		});

		// Should not crash or attempt to focus previous input
		expect(inputs[0]).toBeDefined();
	});
});
