import '../testSetup';
import { render } from '@testing-library/react-native';
import { ListImage } from './ListImage';

describe('ListImage', () => {
	it('renders placeholder icon when no image', () => {
		const { getByTestId } = render(<ListImage />);
		expect(getByTestId('fa-icon')).toBeTruthy();
	});

	it('renders image when provided', () => {
		const { getByTestId } = render(<ListImage image={'http://x'} />);
		expect(getByTestId('list-image').props.source).toMatchObject({
			uri: 'http://x',
		});
	});
});
