import './testSetup';
import { fireEvent, render } from '@testing-library/react-native';
import { router } from 'expo-router';
import { PageTitleWithImage } from './PageTitleWithImage';

describe('PageTitleWithImage', () => {
	it('renders title', () => {
		const { getByText } = render(
			<PageTitleWithImage title={'Title'} placeholderIcon={{} as any} />,
		);
		expect(getByText('Title')).toBeTruthy();
	});

	it('renders description when provided', () => {
		const { getByText } = render(
			<PageTitleWithImage
				title={'Title'}
				description={'Desc'}
				placeholderIcon={{} as any}
			/>,
		);
		expect(getByText('Desc')).toBeTruthy();
	});

	it('handles back, edit, and refetch actions', () => {
		const onEdit = jest.fn();
		const refetch = jest.fn();
		const { getByTestId } = render(
			<PageTitleWithImage
				title={'Title'}
				placeholderIcon={{} as any}
				onEdit={onEdit}
				refetch={refetch}
			/>,
		);

		fireEvent.press(getByTestId('page-title-back'));
		expect(router.back).toHaveBeenCalled();

		fireEvent.press(getByTestId('page-title-edit'));
		expect(onEdit).toHaveBeenCalled();

		fireEvent.press(getByTestId('page-title-refresh'));
		expect(refetch).toHaveBeenCalled();
	});
});
