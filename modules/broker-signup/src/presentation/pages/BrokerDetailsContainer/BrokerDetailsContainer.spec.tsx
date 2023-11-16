import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { render, fireEvent } from '@testing-library/react';
import BrokerDetailsContainer from './BrokerDetailsContainer';
import { store } from '../../../config/store';
import { brokerInformationSliceActions } from '../../../application/features/brokerInformation/BrokerInformationSlice';
import { brokerInformationAdapter } from '../../../application/features/brokerInformation/adapters/BrokerInformationAdapter';

describe('BrokerDetailsContainer component', () => {
  const historyMock = jest.fn();

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
    const { baseElement, getByText, getByTestId } = render(
      <Provider store={store}>
        <BrokerDetailsContainer {...props} />
      </Provider>,
    );

    expect(baseElement).toBeTruthy();
    expect(
      getByText('Agora, revise e nos informe os demais dados da corretora'),
    ).toBeInTheDocument();
    expect(getByTestId('go-back-btn')).toBeInTheDocument();
  });

  it('Should go back to brokerDetailsContainer if button is clicked', () => {
    const component = render(
      <Provider store={store}>
        <BrokerDetailsContainer {...props} />
      </Provider>,
    );

    const btn = component.getByTestId('go-back-btn');
    fireEvent.click(btn);
    expect(historyMock).toHaveBeenCalledWith('/register-responsible');
  });

  it('Should disable button to brokerDetailsContainer if information is not filled', () => {
    const component = render(
      <Provider store={store}>
        <BrokerDetailsContainer {...props} />
      </Provider>,
    );

    const btn = component.getByTestId('button-broker-details');

    expect(btn).toBeDisabled;
  });
});
