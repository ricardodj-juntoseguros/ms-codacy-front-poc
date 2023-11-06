import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import BrokerDataReviewContainer from './BrokerDataReviewContainer';
import { store } from '../../../config/store';
import { brokerInformationSliceActions } from '../../../application/features/brokerInformation/BrokerInformationSlice';

describe('BrokerDataReviewContainer component', () => {
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
        <BrokerDataReviewContainer {...props} />
      </Provider>,
    );

    expect(baseElement).toBeTruthy();
    expect(
      getByText('Antes de continuar, revise seus dados'),
    ).toBeInTheDocument();
  });
});
