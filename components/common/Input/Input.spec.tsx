import '../testSetup';
import { fireEvent, render } from '@testing-library/react-native';
import { Input } from './Input';

describe('Input', () => {
	it('renders label and value', () => {
		const { getByLabelText } = render(
			<Input
				label={'Email'}
				type={'email'}
				value={'test@example.com'}
				onChange={jest.fn()}
			/>,
		);
		expect(getByLabelText('Email')).toBeTruthy();
	});

	it('calls onBlur when input blurs', () => {
		const onBlur = jest.fn();
		const { getByLabelText } = render(
			<Input
				label={'Email'}
				type={'email'}
				value={'test@example.com'}
				onChange={jest.fn()}
				onBlur={onBlur}
			/>,
		);
		fireEvent(getByLabelText('Email'), 'blur');
		expect(onBlur).toHaveBeenCalled();
	});

	it('renders error message when provided', () => {
		const { getByText } = render(
			<Input
				label={'Email'}
				type={'email'}
				value={'test@example.com'}
				onChange={jest.fn()}
				error={'Invalid'}
			/>,
		);
		expect(getByText('Invalid')).toBeTruthy();
	});
});
