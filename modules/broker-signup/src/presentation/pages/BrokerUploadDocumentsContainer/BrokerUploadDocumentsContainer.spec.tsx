import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import  BrokerUploadDocumentsContainer  from './BrokerUploadDocumentsContainer';
import { store } from '../../../config/store';
import {
  brokerInformationSliceActions
} from '../../../application/features/brokerInformation/BrokerInformationSlice';

describe('BrokerUploadDocumentsContainer component', () => {
  const historyMock = jest.fn();

  const props = {
    history: {
      push: historyMock as any,
    } as any,
    location: {} as any,
    match: {} as any,
  };

  afterEach(() => {
    store.dispatch(brokerInformationSliceActions.resetBrokerInformation());
  });

  it('should render successfully', () => {

    const { baseElement, getByText, getByTestId } = render(
    <Provider store={store}>
      <BrokerUploadDocumentsContainer {...props}/>
    </Provider>);

    expect(baseElement).toBeTruthy();
    expect(getByText('Por último, precisamos de alguns documentos da corretora')).toBeInTheDocument();
    expect(getByTestId('go-back-btn')).toBeInTheDocument();
  });
});
