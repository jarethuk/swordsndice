import '../testSetup';
import { render } from '@testing-library/react-native';
import { Text } from 'react-native';
import { Page } from './Page';

describe('Page', () => {
	it('renders title and children', () => {
		const { getByText } = render(
			<Page title={'Page Title'}>
				<Text>Body</Text>
			</Page>,
		);
		expect(getByText('Page Title')).toBeTruthy();
		expect(getByText('Body')).toBeTruthy();
	});

	it('adds refresh control when refetch is provided', () => {
		const refetch = jest.fn();
		const { getByTestId } = render(
			<Page title={'Page Title'} refetch={refetch}>
				<Text>Body</Text>
			</Page>,
		);
		expect(getByTestId('page-scroll').props.refreshControl).toBeTruthy();
	});
});
