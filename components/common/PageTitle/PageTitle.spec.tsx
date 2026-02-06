import '../testSetup';
import { fireEvent, render } from '@testing-library/react-native';
import { PageTitle } from './PageTitle';

describe('PageTitle', () => {
	it('renders title and subtitle', () => {
		const { getByText } = render(
			<PageTitle title={'Title'} subtitle={'Subtitle'} />,
		);
		expect(getByText('Title')).toBeTruthy();
		expect(getByText('Subtitle')).toBeTruthy();
	});

	it('returns null when no title', () => {
		const { toJSON } = render(<PageTitle />);
		expect(toJSON()).toBeNull();
	});

	it('triggers refetch when refresh is pressed', () => {
		const refetch = jest.fn();
		const { getByTestId } = render(
			<PageTitle title={'Title'} refetch={refetch} />,
		);
		fireEvent.press(getByTestId('page-title-refresh'));
		expect(refetch).toHaveBeenCalled();
	});
});
