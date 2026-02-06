import '../testSetup';
import { render } from '@testing-library/react-native';
import { FAIcon } from './FAIcon';

describe('FAIcon', () => {
	it('renders', () => {
		const { getByTestId } = render(<FAIcon icon={{} as any} />);
		expect(getByTestId('fa-icon')).toBeTruthy();
	});

	it('uses white colour override', () => {
		const { getByTestId } = render(
			<FAIcon icon={{} as any} colour={'white'} />,
		);
		expect(getByTestId('fa-icon').props.color).toBe('white');
	});
});
