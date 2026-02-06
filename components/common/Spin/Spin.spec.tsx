import '../testSetup';
import { render } from '@testing-library/react-native';
import { Text } from 'react-native';
import { Spin } from './Spin';

describe('Spin', () => {
	it('renders children', () => {
		const { getByText } = render(
			<Spin>
				<Text>Spinning</Text>
			</Spin>,
		);
		expect(getByText('Spinning')).toBeTruthy();
	});
});
