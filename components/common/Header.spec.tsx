import './testSetup';
import { fireEvent, render } from '@testing-library/react-native';
import { router } from 'expo-router';
import { useAPIGameInvites } from '../../api/games/useAPIGameInvites';
import { useAPIGroupInvites } from '../../api/groups/useAPIGroupInvites';
import Header from './Header';

describe('Header', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('renders user and count', () => {
		const { getByText } = render(<Header />);
		expect(getByText('@tester')).toBeTruthy();
		expect(getByText('3')).toBeTruthy();
	});

	it('hides count when there are no invites', () => {
		(useAPIGameInvites as jest.Mock).mockReturnValue({ data: [] });
		(useAPIGroupInvites as jest.Mock).mockReturnValue({ data: [] });
		const { queryByText } = render(<Header />);
		expect(queryByText('0')).toBeNull();
	});

	it('navigates from header actions', () => {
		const { getByTestId } = render(<Header />);

		fireEvent.press(getByTestId('header-profile'));
		expect(router.navigate).toHaveBeenCalledWith('/(tabs)/profile');

		fireEvent.press(getByTestId('header-feedback'));
		expect(router.navigate).toHaveBeenCalledWith({
			pathname: '/(tabs)/feedback',
		});

		fireEvent.press(getByTestId('header-notifications'));
		expect(router.navigate).toHaveBeenCalledWith({
			pathname: '/(tabs)/notifications',
		});
	});
});
