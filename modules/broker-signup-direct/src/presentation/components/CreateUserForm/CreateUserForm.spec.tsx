import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import { store } from '../../../config/store';
import { CreateUserForm } from './CreateUserForm';
import { VALIDATION_MESSAGES } from '../../../constants/validationMessages';
import { brokerInformationSliceActions } from '../../../application/features/brokerInformation/BrokerInformationSlice';

describe('CreateUserForm', () => {
  const historyMock = jest.fn();

  const props = {
    handleGoNextClick: {
      push: historyMock as any,
    } as any,
  };

  afterEach(() => {
    store.dispatch(brokerInformationSliceActions.resetBrokerInformation());
  });

  it('should render successfully', () => {
    const { baseElement } = render(
      <Provider store={store}>
        <CreateUserForm {...props} />
      </Provider>,
    );
    expect(baseElement).toBeTruthy();
  });

  it('should render successfully and change inputs', async () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <CreateUserForm {...props} />
      </Provider>,
    );

    const inputBrokerUserName = getByTestId('broker-userName');
    const inputBrokerPassword = getByTestId('broker-Password');
    const inputBrokerConfirmPassword = getByTestId('broker-ConfirmPassword');

    await act(async () => {
      fireEvent.change(inputBrokerUserName, { target: { value: 'teste' } });
      fireEvent.change(inputBrokerPassword, {
        target: { value: 'Parana.147' },
      });
      fireEvent.change(inputBrokerConfirmPassword, {
        target: { value: 'Parana.147' },
      });
    });

    expect(inputBrokerUserName).toHaveValue('teste');
    expect(inputBrokerPassword).toHaveValue('Parana.147');
    expect(inputBrokerConfirmPassword).toHaveValue('Parana.147');
  });
});
