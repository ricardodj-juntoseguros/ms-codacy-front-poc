import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import BrokerDetailsContainer from './BrokerDetailsContainer';
import { store } from '../../../config/store';
import { brokerInformationSliceActions } from '../../../application/features/brokerInformation/BrokerInformationSlice';

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
    const { baseElement, getByText } = render(
      <Provider store={store}>
        <BrokerDetailsContainer {...props} />
      </Provider>,
    );

    expect(baseElement).toBeTruthy();
    expect(getByText('Dados de cadastro')).toBeInTheDocument();
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
