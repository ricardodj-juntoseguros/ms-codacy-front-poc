import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import { store } from '../../../config/store';
import { BankDetails } from './BankDetails';
import { VALIDATION_MESSAGES } from '../../../constants/validationMessages';
import { brokerInformationSliceActions } from '../../../application/features/brokerInformation/BrokerInformationSlice';

describe('BankDetails', () => {
  const props = {
    bankOptions: [],
    bank: null,
    onSelectBank: jest.fn(),
  };

  afterEach(() => {
    store.dispatch(brokerInformationSliceActions.resetBrokerInformation());
  });

  it('should render successfully', () => {
    const { baseElement } = render(
      <Provider store={store}>
        <BankDetails {...props} />
      </Provider>,
    );
    expect(baseElement).toBeTruthy();
  });

  it('should render successfully and change inputs', async () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <BankDetails {...props} />
      </Provider>,
    );

    const inputBankNumber = getByTestId('bank-number');
    const inputBankDigit = getByTestId('bank-digit');
    const inputAccountNumber = getByTestId('account-number');
    const inputAccountDigit = getByTestId('account-digit');

    await act(async () => {
      fireEvent.change(inputBankNumber, { target: { value: '12345' } });
      fireEvent.change(inputBankDigit, { target: { value: '22' } });
      fireEvent.change(inputAccountNumber, { target: { value: '12345' } });
      fireEvent.change(inputAccountDigit, { target: { value: '22' } });
    });

    expect(inputBankNumber).toHaveValue('12345');
    expect(inputBankDigit).toHaveValue('22');
    expect(inputAccountNumber).toHaveValue('12345');
    expect(inputAccountDigit).toHaveValue('22');
  });

  it('should render successfully with error invalid errors', async () => {
    const { getByTestId, getAllByText } = render(
      <Provider store={store}>
        <BankDetails {...props} />
      </Provider>,
    );

    const inputBankNumber = getByTestId('bank-number');
    const inputBankDigit = getByTestId('bank-digit');
    const inputAccountNumber = getByTestId('account-number');
    const inputAccountDigit = getByTestId('account-digit');

    await act(async () => {
      fireEvent.change(inputBankNumber, { target: { value: '' } });
      fireEvent.blur(inputBankNumber);
      fireEvent.change(inputBankDigit, { target: { value: '' } });
      fireEvent.blur(inputBankDigit);
      fireEvent.change(inputAccountNumber, { target: { value: '' } });
      fireEvent.blur(inputAccountNumber);
      fireEvent.change(inputAccountDigit, { target: { value: '' } });
      fireEvent.blur(inputAccountDigit);
    });
    const errorBankNumber = getAllByText(VALIDATION_MESSAGES.bankNumber);
    const errorAccountNumber = getAllByText(VALIDATION_MESSAGES.accounNumber);
    const errorAccountDigit = getAllByText(VALIDATION_MESSAGES.accounDigit);

    expect(errorBankNumber.length).toEqual(1);
    expect(errorAccountNumber.length).toEqual(1);
    expect(errorAccountDigit.length).toEqual(1);
  });
});
