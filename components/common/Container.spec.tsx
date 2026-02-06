import './testSetup';
import { render } from '@testing-library/react-native';
import { Text } from 'react-native';
import { Container } from './Container';

describe('Container', () => {
	it('renders children', () => {
		const { getByText } = render(
			<Container>
				<Text>Child</Text>
			</Container>,
		);
		expect(getByText('Child')).toBeTruthy();
	});
});
