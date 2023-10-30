import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import { store } from '../../../config/store';
import { ResponsibleInformation } from './ResponsibleInformation';
import { VALIDATION_MESSAGES } from '../../../constants/validationMessages';
import { responsibleInformationSliceActions } from '../../../application/features/responsibleInformation/ResponsibleInformationSlice';

describe('ResponsibleInformation', () => {
  afterEach(() => {
    store.dispatch(
      responsibleInformationSliceActions.resetResponsibleInformationSlice(),
    );
  });

  it('should render successfully', () => {
    const { baseElement } = render(
      <Provider store={store}>
        <ResponsibleInformation />
      </Provider>,
    );
    expect(baseElement).toBeTruthy();
  });

  it('should render successfully and change inputs', async () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <ResponsibleInformation />
      </Provider>,
    );

    const inputCpf = getByTestId('broker-federalId');
    const inputPhone = getByTestId('broker-phone');

    await act(async () => {
      fireEvent.change(inputCpf, { target: { value: '9999999999' } });
      fireEvent.change(inputPhone, { target: { value: '4199999999' } });
    });

    expect(inputCpf).toHaveValue('9999999999');
    expect(inputPhone).toHaveValue('(41) 9999-9999');
  });

  it('should render successfully with error invalid errors', async () => {
    const { getByTestId, getByText } = render(
      <Provider store={store}>
        <ResponsibleInformation />
      </Provider>,
    );

    const inputCpf = getByTestId('broker-federalId');
    const inputPhone = getByTestId('broker-phone');

    await act(async () => {
      fireEvent.change(inputCpf, { target: { value: '99999999' } });
      fireEvent.blur(inputCpf);
      fireEvent.change(inputPhone, { target: { value: '49999999' } });
      fireEvent.blur(inputPhone);
    });

    expect(
      getByText(VALIDATION_MESSAGES.documentNumberIsNull),
    ).toBeInTheDocument();
    expect(getByText(VALIDATION_MESSAGES.phoneIsNull)).toBeInTheDocument();
  });
});
