import '@testing-library/jest-dom';
import { fireEvent, render } from '../../../config/testUtils';
import ProcessListProcessFilter from './ProcessListProcessFilter';

describe('ProcessListStatusFilter', () => {
  it('Should call callback with input value on input fill and enter key press', async () => {
    const callbackMock = jest.fn();
    const { getByTestId } = render(
      <ProcessListProcessFilter
        changeProcessValueCallback={callbackMock}
        showClearButton={false}
        isLoadingProcesses={false}
      />,
    );

    const input = getByTestId('processListProcessFilter-input');
    fireEvent.change(input, { target: { value: '1234567' } });
    fireEvent.keyDown(input, {
      key: 'Enter',
      code: 'Enter',
      keyCode: 13,
      charCode: 13,
    });
    expect(callbackMock).toHaveBeenCalledWith('1234567');
  });

  it('Should call callback with input value on input fill and icon click', async () => {
    const callbackMock = jest.fn();
    const { getByTestId } = render(
      <ProcessListProcessFilter
        changeProcessValueCallback={callbackMock}
        showClearButton={false}
        isLoadingProcesses={false}
      />,
    );
    const input = getByTestId('processListProcessFilter-input');
    const button = getByTestId('icon-linkButton');
    fireEvent.change(input, { target: { value: '1234567' } });
    fireEvent.click(button);
    expect(callbackMock).toHaveBeenCalledWith('1234567');
  });

  it('Should call callback with null on clear button click', async () => {
    const callbackMock = jest.fn();
    const { getByTestId } = render(
      <ProcessListProcessFilter
        changeProcessValueCallback={callbackMock}
        showClearButton
        isLoadingProcesses={false}
      />,
    );
    const button = getByTestId('processListProcessFilter-btn-clear');
    fireEvent.click(button);
    expect(callbackMock).toHaveBeenCalledWith(null);
  });

  it('Should call callback with null value when input is filled and is focused, then cleared and blurred', async () => {
    const callbackMock = jest.fn();
    const { getByTestId } = render(
      <ProcessListProcessFilter
        changeProcessValueCallback={callbackMock}
        showClearButton={false}
        isLoadingProcesses={false}
      />,
    );
    const input = getByTestId('processListProcessFilter-input');
    fireEvent.change(input, { target: { value: '1234567' } });
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: '' } });
    fireEvent.blur(input);
    expect(callbackMock).toHaveBeenCalledWith(null);
  });
});
