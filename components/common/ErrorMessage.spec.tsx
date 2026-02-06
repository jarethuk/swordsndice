import './testSetup';
import { render } from '@testing-library/react-native';
import { ErrorMessage } from './ErrorMessage';

describe('ErrorMessage', () => {
	it('renders message', () => {
		const { getByText } = render(<ErrorMessage message={'Something failed'} />);
		expect(getByText('Something failed')).toBeTruthy();
	});

	it('renders error response message', () => {
		const error = {
			message: 'Fallback',
			response: { data: { error: 'Response error' } },
		} as any;
		const { getByText } = render(<ErrorMessage error={error} />);
		expect(getByText('Response error')).toBeTruthy();
	});

	it('returns null with no inputs', () => {
		const { toJSON } = render(<ErrorMessage />);
		expect(toJSON()).toBeNull();
	});
});
