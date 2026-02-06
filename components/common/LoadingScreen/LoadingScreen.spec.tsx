import '../testSetup';
import { render } from '@testing-library/react-native';
import { LoadingScreen } from './LoadingScreen';

describe('LoadingScreen', () => {
	it('renders message', () => {
		const { getByText } = render(<LoadingScreen message={'Loading...'} />);
		expect(getByText('Loading...')).toBeTruthy();
	});
});
