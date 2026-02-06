import type { AxiosError } from 'axios';
import { Alert } from '../Alert';

interface Props {
	message?: string;
	error?: AxiosError | null;
}

export const ErrorMessage = ({ message, error }: Props) => {
	if (message) {
		return <Alert type={'error'} message={message} />;
	}

	if (error) {
		return (
			<Alert
				type={'error'}
				message={(error.response?.data as any)?.error ?? error.message}
			/>
		);
	}
};
