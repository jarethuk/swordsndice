import './testSetup';
import { fireEvent, render } from '@testing-library/react-native';
import { ShowMoreText } from './ShowMoreText';

describe('ShowMoreText', () => {
	it('toggles expanded state', () => {
		const text = 'x'.repeat(120);
		const { getByText } = render(<ShowMoreText text={text} />);
		fireEvent.press(getByText('Show more'));
		expect(getByText('Hide')).toBeTruthy();
	});

	it('does not show toggle for short text', () => {
		const { queryByText } = render(<ShowMoreText text={'short'} />);
		expect(queryByText('Show more')).toBeNull();
	});
});
