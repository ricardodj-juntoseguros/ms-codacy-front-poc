import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import CreateUserAccessContainer from './CreateUserAccessContainer';
import { store } from '../../../config/store';
import { brokerInformationSliceActions } from '../../../application/features/brokerInformation/BrokerInformationSlice';

describe('CreateUserAccessContainer component', () => {
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
        <CreateUserAccessContainer {...props} />
      </Provider>,
    );

    expect(baseElement).toBeTruthy();
    expect(getByText('Agora vamos criar seu acesso')).toBeInTheDocument();
  });
});
