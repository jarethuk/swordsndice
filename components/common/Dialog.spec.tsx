import './testSetup';
import { render } from '@testing-library/react-native';
import { Text } from 'react-native';
import { Dialog } from './Dialog';

describe('Dialog (native)', () => {
	it('renders content', () => {
		const { getByText } = render(
			<Dialog title={'Title'} subtitle={'Sub'}>
				<Text>Body</Text>
			</Dialog>,
		);
		expect(getByText('Title')).toBeTruthy();
		expect(getByText('Sub')).toBeTruthy();
		expect(getByText('Body')).toBeTruthy();
	});

	it('omits subtitle when not provided', () => {
		const { getByText, queryByText } = render(
			<Dialog title={'Title'}>
				<Text>Body</Text>
			</Dialog>,
		);
		expect(getByText('Title')).toBeTruthy();
		expect(queryByText('Sub')).toBeNull();
	});
});
