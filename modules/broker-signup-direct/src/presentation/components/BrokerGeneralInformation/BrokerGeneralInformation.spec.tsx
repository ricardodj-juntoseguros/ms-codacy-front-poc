import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import { store } from '../../../config/store';
import { BrokerGeneralInformation } from './BrokerGeneralInformation';
import { brokerInformationSliceActions } from '../../../application/features/brokerInformation/BrokerInformationSlice';

describe('BrokerGeneralInformation', () => {
  afterEach(() => {
    store.dispatch(brokerInformationSliceActions.resetBrokerInformation());
  });

  it('should render successfully', () => {
    const { baseElement } = render(
      <Provider store={store}>
        <BrokerGeneralInformation />
      </Provider>,
    );
    expect(baseElement).toBeTruthy();
  });

  it('should render successfully and change inputs', async () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <BrokerGeneralInformation />
      </Provider>,
    );

    const inputIss = getByTestId('broker-iss');

    await act(async () => {
      fireEvent.change(inputIss, { target: { value: 1.0 } });
    });

    expect(inputIss).toHaveValue('1%');
  });
});
