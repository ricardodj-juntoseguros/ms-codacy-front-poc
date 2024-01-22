import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { fireEvent, render, act } from '@testing-library/react';
import BrokerDataReviewContainer from './BrokerDataReviewContainer';
import { store } from '../../../config/store';
import { brokerInformationSliceActions } from '../../../application/features/brokerInformation/BrokerInformationSlice';
import RDStationAPI from '../../../application/features/RDStation/RDStationAPI';

describe('BrokerDataReviewContainer component', () => {
  const historyMock = jest.fn();

  const RDspy = jest.spyOn(RDStationAPI, 'addLeadBrokerSignup');

  const mockRDStation = {
    LeadConversionIdentifier: 'Cadastro do Corretor - Aprovação',
    Email: 'teste@teste.com',
    phone: '41999999999',
    urlConversion: window.location.href,
    internalizationReasons: 'teste',
  };

  const props = {
    history: {
      push: historyMock as any,
    } as any,
    location: {} as any,
    match: {} as any,
  };

  beforeEach(() => {
    store.dispatch(brokerInformationSliceActions.resetBrokerInformation());
  });

  it('should render successfully', () => {
    const { baseElement, getByText } = render(
      <Provider store={store}>
        <BrokerDataReviewContainer {...props} />
      </Provider>,
    );

    expect(baseElement).toBeTruthy();
    expect(
      getByText('Antes de continuar, revise seus dados'),
    ).toBeInTheDocument();
  });

  it('should send lead to RD Station correctly', async () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <BrokerDataReviewContainer {...props} />
      </Provider>,
    );

    RDspy.mockImplementation(() => Promise.resolve(mockRDStation));

    const btn = getByTestId('button-broker-details');

    await act(async () => {
      fireEvent.click(btn);
    });
    expect(RDspy).toBeCalled();
  });

  it('should call authRDBrokerSignup method correctly', async () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <BrokerDataReviewContainer {...props} />
      </Provider>,
    );

    RDspy.mockImplementation(() => Promise.reject(new Error()));

    const authRDBspy = jest.spyOn(RDStationAPI, 'authRDBrokerSignup');

    const btn = getByTestId('button-broker-details');

    await act(async () => {
      fireEvent.click(btn);
    });
    expect(authRDBspy).toBeCalled();
  });
});
