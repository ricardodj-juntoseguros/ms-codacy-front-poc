import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import * as reactRedux from 'react-redux';
import { render, act, fireEvent } from '@testing-library/react';
import BrokerInitialUploadDocumentsContainer from './BrokerInitialUploadDocumentsContainer';
import { store } from '../../../config/store';
import { brokerInformationSliceActions } from '../../../application/features/brokerInformation/BrokerInformationSlice';

describe('BrokerInitialUploadDocumentsContainer component', () => {
  const historyMock = jest.fn();
  const useDispatchMock = jest.spyOn(reactRedux, 'useDispatch');

  const props = {
    history: {
      push: historyMock as any,
    } as any,
    location: {} as any,
    match: {} as any,
  };

  beforeAll(() => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { assign: jest.fn() },
    });
  });

  beforeEach(() => {
    store.dispatch(
      brokerInformationSliceActions.setFederalId('00124457000108'),
    );
  });

  afterEach(() => {
    store.dispatch(brokerInformationSliceActions.resetBrokerInformation());
  });

  it('should render successfully', () => {
    const { baseElement, getByText, getByTestId } = render(
      <Provider store={store}>
        <BrokerInitialUploadDocumentsContainer {...props} />
      </Provider>,
    );

    const button = getByTestId('button-broker-go-to-upload');

    expect(getByText('Quase lá!')).toBeInTheDocument();
    expect(
      getByText('Por último precisamos de alguns documentos.'),
    ).toBeInTheDocument();
    expect(getByText('Comprovante de endereço')).toBeInTheDocument();
    expect(getByText('Comprovante bancário')).toBeInTheDocument();
    expect(getByText('Contrato Social')).toBeInTheDocument();
    expect(button).toBeEnabled();

    expect(baseElement).toBeTruthy();
  });
});
