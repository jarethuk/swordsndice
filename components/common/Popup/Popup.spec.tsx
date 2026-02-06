import '../testSetup';
import { render } from '@testing-library/react-native';
import { Text } from 'react-native';
import { Popup } from './Popup';

describe('Popup', () => {
	it('renders children', () => {
		const { getByText } = render(
			<Popup onDismiss={jest.fn()}>
				<Text>Popup content</Text>
			</Popup>,
		);
		expect(getByText('Popup content')).toBeTruthy();
	});
});
