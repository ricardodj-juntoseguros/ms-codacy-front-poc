import { Provider } from 'react-redux';
import { store } from 'modules/broker-signup-direct/src/config/store';
import * as reactRedux from 'react-redux';
import { brokerInformationSliceActions } from 'modules/broker-signup-direct/src/application/features/brokerInformation/BrokerInformationSlice';
import { fireEvent, render, act } from '../../../config/testUtils';
import SearchRegistration from './SearchRegistrationContainer';

describe('SearchRegistration component', () => {
  const historyMock = jest.fn();
  const useDispatchMock = jest.spyOn(reactRedux, 'useDispatch');

  beforeEach(() => {
    store.dispatch(
      brokerInformationSliceActions.setFederalId('00124457000108'),
    );
  });

  beforeAll(() => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { assign: historyMock },
    });
  });

  const props = {
    history: {
      push: historyMock as any,
    } as any,
    location: {} as any,
    match: {} as any,
  };

  it('should render successfully', () => {
    const { baseElement } = render(<SearchRegistration {...props} />);

    expect(baseElement).toBeTruthy();
  });

  it('should redirect to new clients page on click button', async () => {
    const baseElement = render(
      <Provider store={store}>
        <SearchRegistration {...props} />
      </Provider>,
    );
    useDispatchMock.mockImplementation(() => historyMock);

    const btn = baseElement.getByTestId('redirect-linkButton');
    await act(async () => {
      await fireEvent.click(btn);
    });

    expect(window.location.assign).toHaveBeenCalledWith(
      process.env.NX_GLOBAL_LOGIN_NOVOS_CLIENTES,
    );
  });
});
