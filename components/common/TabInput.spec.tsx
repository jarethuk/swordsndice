import './testSetup';
import { fireEvent, render } from '@testing-library/react-native';
import { TabInput } from './TabInput';

describe('TabInput', () => {
	it('renders tabs', () => {
		const { getByText } = render(
			<TabInput
				selected={'a'}
				onChange={jest.fn()}
				tabs={[
					{ title: 'Alpha', value: 'a' },
					{ title: 'Beta', value: 'b' },
				]}
			/>,
		);
		expect(getByText('Alpha')).toBeTruthy();
		expect(getByText('Beta')).toBeTruthy();
	});

	it('calls onChange when a tab is pressed', () => {
		const onChange = jest.fn();
		const { getByText } = render(
			<TabInput
				selected={'a'}
				onChange={onChange}
				tabs={[
					{ title: 'Alpha', value: 'a' },
					{ title: 'Beta', value: 'b' },
				]}
			/>,
		);
		fireEvent.press(getByText('Beta'));
		expect(onChange).toHaveBeenCalledWith('b');
	});
});
