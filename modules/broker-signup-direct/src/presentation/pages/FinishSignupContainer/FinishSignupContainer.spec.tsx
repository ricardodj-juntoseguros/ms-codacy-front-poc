import '@testing-library/jest-dom';
import * as reactRedux from 'react-redux';
import { Provider } from 'react-redux';
import { fireEvent, render, act } from '@testing-library/react';
import FinishSignupContainer from './FinishSignupContainer';
import { store } from '../../../config/store';
import { brokerInformationSliceActions } from '../../../application/features/brokerInformation/BrokerInformationSlice';

describe('FinishSignupContainer component', () => {
  const historyMock = jest.fn();
  const useDispatchMock = jest.spyOn(reactRedux, 'useDispatch');

  const props = {
    history: {
      push: historyMock as any,
    } as any,
    location: {} as any,
    match: {} as any,
  };

  beforeEach(() => {
    store.dispatch(
      brokerInformationSliceActions.setFederalId('00124457000108'),
    );
  });

  beforeAll(() => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { assign: jest.fn() },
    });
  });

  it('should render successfully', () => {
    const { baseElement, getByText, getByTestId } = render(
      <Provider store={store}>
        <FinishSignupContainer {...props} />
      </Provider>,
    );
    const btn = getByTestId('button-access-now');

    expect(baseElement).toBeTruthy();
    expect(getByText('Vem Junto!')).toBeInTheDocument();
    expect(getByText('Seu acesso está pronto')).toBeInTheDocument();
    expect(
      getByText('Use seu usuário para acessar a plataforma:'),
    ).toBeInTheDocument();
    expect(btn).toBeEnabled;
  });

  it('Should go to login page on access now button click', async () => {
    const baseElement = render(
      <Provider store={store}>
        <FinishSignupContainer {...props} />
      </Provider>,
    );
    useDispatchMock.mockImplementation(() => historyMock);

    const btn = baseElement.getByTestId('button-access-now');
    await act(async () => {
      await fireEvent.click(btn);
    });

    expect(window.location.assign).toHaveBeenCalledWith(
      process.env.NX_GLOBAL_BROKER_PLATFORM_URL,
    );
  });
});
