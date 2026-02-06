import '../testSetup';
import { render } from '@testing-library/react-native';
import { Content } from './Content';

describe('Content', () => {
	it('renders text', () => {
		const { getByText } = render(
			<Content type={'body'} size={'md'}>
				Text
			</Content>,
		);
		expect(getByText('Text')).toBeTruthy();
	});

	it('applies wrap and variant styles', () => {
		const { getByText } = render(
			<Content type={'body'} size={'md'} wrap variant={'positive'}>
				Text
			</Content>,
		);
		const styles = getByText('Text').props.style.flat();
		expect(styles).toEqual(
			expect.arrayContaining([expect.objectContaining({ flexShrink: 1 })]),
		);
		expect(styles).toEqual(
			expect.arrayContaining([expect.objectContaining({ color: '#333333' })]),
		);
	});
});
