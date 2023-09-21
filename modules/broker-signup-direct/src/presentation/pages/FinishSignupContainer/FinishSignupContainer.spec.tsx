import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import  FinishSignupContainer  from './FinishSignupContainer';
import { store } from '../../../config/store';
import {
  brokerInformationSliceActions
} from '../../../application/features/brokerInformation/BrokerInformationSlice';

describe('FinishSignupContainer component', () => {
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

    const { baseElement, getByText } = render(
    <Provider store={store}>
      <FinishSignupContainer {...props}/>
    </Provider>);

    expect(baseElement).toBeTruthy();
    expect(getByText('Cadastro solicitado! Fique de olho, entraremos em contato com você.')).toBeInTheDocument();
    expect(getByText('Você receberá um e-mail para dar sequência na criação do seu acesso.')).toBeInTheDocument();

  });
});
