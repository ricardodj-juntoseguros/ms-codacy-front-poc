import '@testing-library/jest-dom';
import { act, render } from '../../../config/testUtils';
import RadioButton from './RadioButton';

describe('RadioButton', () => {
  const onChangeMock = jest.fn();
  it('should be able to call onchange correctly', () => {
    const { getByText, getByTestId } = render(
      <RadioButton
        id="radio-button"
        data-testid="radio-button"
        label="label test"
        name="test"
        onChange={onChangeMock}
        selectedValue={false}
        value="test"
      />,
    );
    const input = getByTestId('radio-button');
    act(() => {
      input.click();
    });
    expect(getByText('label test')).toBeInTheDocument();
    expect(getByTestId('radio-button')).toBeInTheDocument();
    expect(onChangeMock).toHaveBeenCalledTimes(1);
  });
});
