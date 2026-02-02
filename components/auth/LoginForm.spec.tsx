import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { useAPILogin } from '../../api/auth/useAPILogin';
import { useUserActions } from '../../states/useUserStore';
import { LoginForm } from './LoginForm';

jest.mock('../../api/auth/useAPILogin');
jest.mock('../../states/useUserStore');
jest.mock('./GoogleLoginButton', () => {
	const { Text } = require('react-native');
	return {
		__esModule: true,
		default: () => <Text>GoogleLoginButton</Text>,
	};
});

const mockUseAPILogin = useAPILogin as jest.MockedFunction<typeof useAPILogin>;
const mockUseUserActions = useUserActions as jest.MockedFunction<
	typeof useUserActions
>;

describe('LoginForm', () => {
	const mockSetUser = jest.fn();
	const mockMutateAsync = jest.fn();

	beforeEach(() => {
		jest.clearAllMocks();

		mockUseUserActions.mockReturnValue({
			setUser: mockSetUser,
		});

		mockUseAPILogin.mockReturnValue({
			mutateAsync: mockMutateAsync,
			error: undefined,
		} as any);
	});

	it('renders initial email form', () => {
		const { getByText, getByLabelText } = render(<LoginForm />);

		expect(getByText('Swords & Dice')).toBeTruthy();
		expect(getByText('Enter your email address to get started')).toBeTruthy();
		expect(getByLabelText('Email')).toBeTruthy();
		expect(getByText('Continue')).toBeTruthy();
	});

	it('renders social login options', () => {
		const { getByText } = render(<LoginForm />);

		expect(getByText('Login with Apple')).toBeTruthy();
		expect(getByText('GoogleLoginButton')).toBeTruthy();
	});

	it('updates email input value', () => {
		const { getByLabelText } = render(<LoginForm />);
		const input = getByLabelText('Email');

		fireEvent.changeText(input, 'test@example.com');

		expect(input.props.value).toBe('test@example.com');
	});

	it('sends OTP when Continue button is pressed', async () => {
		mockMutateAsync.mockResolvedValue(undefined);

		const { getByText, getByLabelText } = render(<LoginForm />);
		const input = getByLabelText('Email');
		const continueButton = getByText('Continue');

		fireEvent.changeText(input, 'test@example.com');
		fireEvent.press(continueButton);

		await waitFor(() => {
			expect(mockMutateAsync).toHaveBeenCalledWith({
				email: 'test@example.com',
			});
			expect(getByText('Enter the code sent to test@example.com')).toBeTruthy();
		});
	});

	it('shows code entry screen after email is sent', async () => {
		mockMutateAsync.mockResolvedValue(undefined);

		const { getByText, getByLabelText, queryByText } = render(<LoginForm />);
		const input = getByLabelText('Email');
		const continueButton = getByText('Continue');

		fireEvent.changeText(input, 'test@example.com');
		fireEvent.press(continueButton);

		await waitFor(() => {
			expect(getByText('Enter the code sent to test@example.com')).toBeTruthy();
			expect(getByText('Back')).toBeTruthy();
			expect(queryByText('Continue')).toBeNull();
		});
	});

	it('prevents multiple OTP sends when already sending', async () => {
		let resolvePromise: () => void;

		const promise = new Promise<void>((resolve) => {
			resolvePromise = resolve;
		});

		mockMutateAsync.mockReturnValue(promise as any);

		const { getByText, getByLabelText } = render(<LoginForm />);
		const input = getByLabelText('Email');
		const continueButton = getByText('Continue');

		fireEvent.changeText(input, 'test@example.com');
		fireEvent.press(continueButton);
		fireEvent.press(continueButton);
		fireEvent.press(continueButton);

		await waitFor(() => {
			expect(mockMutateAsync).toHaveBeenCalledTimes(1);
		});

		resolvePromise!();

		await waitFor(() => {
			expect(getByText('Enter the code sent to test@example.com')).toBeTruthy();
		});
	});

	it('allows user to go back to email entry from code screen', async () => {
		mockMutateAsync.mockResolvedValue(undefined);

		const { getByText, getByLabelText, queryByText } = render(<LoginForm />);
		const input = getByLabelText('Email');
		const continueButton = getByText('Continue');

		fireEvent.changeText(input, 'test@example.com');
		fireEvent.press(continueButton);

		await waitFor(() => {
			expect(getByText('Back')).toBeTruthy();
		});

		const backButton = getByText('Back');
		fireEvent.press(backButton);

		expect(queryByText('Enter the code sent to test@example.com')).toBeNull();
		expect(getByText('Continue')).toBeTruthy();
	});

	it('logs in user when code is entered', async () => {
		const mockUser = { id: '123', name: 'Test User' };
		mockMutateAsync
			.mockResolvedValueOnce(undefined)
			.mockResolvedValueOnce(mockUser);

		const { getByText, getByLabelText, getAllByRole } = render(<LoginForm />);
		const input = getByLabelText('Email');
		const continueButton = getByText('Continue');

		fireEvent.changeText(input, 'test@example.com');
		fireEvent.press(continueButton);

		await waitFor(() => {
			expect(getByText('Enter the code sent to test@example.com')).toBeTruthy();
		});

		const codeInputs = getAllByRole('none');
		fireEvent.changeText(codeInputs[0], '1');
		fireEvent.changeText(codeInputs[1], '2');
		fireEvent.changeText(codeInputs[2], '3');
		fireEvent.changeText(codeInputs[3], '4');
		fireEvent.changeText(codeInputs[4], '5');
		fireEvent.changeText(codeInputs[5], '6');

		await waitFor(() => {
			expect(mockMutateAsync).toHaveBeenCalledWith({
				email: 'test@example.com',
				code: '123456',
			});
			expect(mockSetUser).toHaveBeenCalledWith(mockUser);
		});
	});

	it('shows loading screen while logging in', async () => {
		let resolvePromise: (value: any) => void;
		const promise = new Promise<any>((resolve) => {
			resolvePromise = resolve;
		});
		mockMutateAsync
			.mockResolvedValueOnce(undefined)
			.mockReturnValueOnce(promise as any);

		const { getByText, getByLabelText, getAllByRole } = render(<LoginForm />);
		const input = getByLabelText('Email');
		const continueButton = getByText('Continue');

		fireEvent.changeText(input, 'test@example.com');
		fireEvent.press(continueButton);

		await waitFor(() => {
			expect(getByText('Enter the code sent to test@example.com')).toBeTruthy();
		});

		const codeInputs = getAllByRole('none');
		fireEvent.changeText(codeInputs[0], '123456');

		await waitFor(() => {
			expect(getByText('Checking code...')).toBeTruthy();
		});

		resolvePromise!({ id: '123', name: 'Test User' });

		await waitFor(() => {
			expect(mockSetUser).toHaveBeenCalledWith({
				id: '123',
				name: 'Test User',
			});
		});
	});

	it('prevents multiple login attempts when already logging in', async () => {
		let resolvePromise: (value: any) => void;
		const promise = new Promise<any>((resolve) => {
			resolvePromise = resolve;
		});
		mockMutateAsync
			.mockResolvedValueOnce(undefined)
			.mockReturnValueOnce(promise as any);

		const { getByText, getByLabelText, getAllByRole } = render(<LoginForm />);
		const input = getByLabelText('Email');
		const continueButton = getByText('Continue');

		fireEvent.changeText(input, 'test@example.com');
		fireEvent.press(continueButton);

		await waitFor(() => {
			expect(getByText('Enter the code sent to test@example.com')).toBeTruthy();
		});

		const codeInputs = getAllByRole('none');
		fireEvent.changeText(codeInputs[0], '123456');
		fireEvent.changeText(codeInputs[0], '654321');

		resolvePromise!({ id: '123', name: 'Test User' });

		await waitFor(() => {
			expect(mockMutateAsync).toHaveBeenCalledTimes(2); // Once for OTP, once for login
			expect(mockSetUser).toHaveBeenCalledWith({
				id: '123',
				name: 'Test User',
			});
		});
	});

	it('displays API error message when OTP send fails', async () => {
		const errorMessage = 'Invalid email address';
		mockUseAPILogin.mockReturnValue({
			mutateAsync: mockMutateAsync,
			error: { message: errorMessage },
		} as any);

		const { getByText } = render(<LoginForm />);

		expect(getByText(errorMessage)).toBeTruthy();
	});

	it('displays API error message when login fails', async () => {
		const errorMessage = 'Invalid code';
		mockMutateAsync
			.mockResolvedValueOnce(undefined)
			.mockRejectedValueOnce(new Error(errorMessage));

		mockUseAPILogin.mockReturnValue({
			mutateAsync: mockMutateAsync,
			error: { message: errorMessage },
		} as any);

		const { getByText, getByLabelText, getAllByRole } = render(<LoginForm />);
		const input = getByLabelText('Email');
		const continueButton = getByText('Continue');

		fireEvent.changeText(input, 'test@example.com');
		fireEvent.press(continueButton);

		await waitFor(() => {
			expect(getByText('Enter the code sent to test@example.com')).toBeTruthy();
		});

		expect(getByText(errorMessage)).toBeTruthy();
	});

	it('handles OTP send error gracefully', async () => {
		mockMutateAsync.mockRejectedValue(new Error('Network error'));

		const { getByText, getByLabelText } = render(<LoginForm />);
		const input = getByLabelText('Email');
		const continueButton = getByText('Continue');

		fireEvent.changeText(input, 'test@example.com');
		fireEvent.press(continueButton);

		await waitFor(() => {
			expect(mockMutateAsync).toHaveBeenCalled();
			// Should still show email form, not code entry
			expect(getByText('Continue')).toBeTruthy();
		});
	});
});
