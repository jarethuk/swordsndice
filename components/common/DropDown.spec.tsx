import './testSetup';
import { fireEvent, render } from '@testing-library/react-native';
import { DropDown } from './DropDown';

describe('DropDown', () => {
	it('renders and opens options', () => {
		const onChange = jest.fn();
		const { getByText, queryByText } = render(
			<DropDown
				selected={'a'}
				onChange={onChange}
				options={[
					{ title: 'Alpha', value: 'a' },
					{ title: 'Beta', value: 'b' },
				]}
			/>,
		);
		fireEvent.press(getByText('Alpha'));
		expect(getByText('Beta')).toBeTruthy();

		fireEvent.press(getByText('Beta'));
		expect(onChange).toHaveBeenCalledWith('b');
		expect(queryByText('Beta')).toBeNull();
	});
});
