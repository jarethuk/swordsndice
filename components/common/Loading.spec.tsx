import './testSetup';
import { render } from '@testing-library/react-native';
import { Loading } from './Loading';

describe('Loading', () => {
	it('renders default spinner', () => {
		const { getByTestId } = render(<Loading />);
		expect(getByTestId('loading-spinner').props.source).toBe('spinner');
	});

	it('renders white spinner', () => {
		const { getByTestId } = render(<Loading white />);
		expect(getByTestId('loading-spinner').props.source).toBe('spinner-white');
	});
});
