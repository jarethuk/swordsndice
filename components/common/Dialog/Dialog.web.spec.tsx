import '../testSetup';
import { fireEvent, render } from '@testing-library/react-native';
import { router } from 'expo-router';
import { Text } from 'react-native';
import { Dialog } from './Dialog.web';

describe('Dialog (web)', () => {
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

	it('dismisses on backdrop press', () => {
		const { getByTestId } = render(
			<Dialog title={'Title'}>
				<Text>Body</Text>
			</Dialog>,
		);
		fireEvent.press(getByTestId('dialog-backdrop'));
		expect(router.dismiss).toHaveBeenCalled();
	});
});
