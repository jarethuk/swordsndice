import './testSetup';
import { render } from '@testing-library/react-native';
import { Alert } from './Alert';

describe('Alert', () => {
	it('renders message', () => {
		const { getByText } = render(<Alert type={'info'} message={'Hello'} />);
		expect(getByText('Hello')).toBeTruthy();
	});

	it('renders error object message', () => {
		const { getByText } = render(
			<Alert type={'error'} message={new Error('Boom')} />,
		);
		expect(getByText('Boom')).toBeTruthy();
	});

	it('returns null when message is empty', () => {
		const { toJSON } = render(<Alert type={'info'} message={null} />);
		expect(toJSON()).toBeNull();
	});
});
