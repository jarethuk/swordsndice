import '../testSetup';
import { render } from '@testing-library/react-native';
import Divider from './Divider';

describe('Divider', () => {
	it('renders', () => {
		const { toJSON } = render(<Divider />);
		expect(toJSON()).toBeTruthy();
	});
});
