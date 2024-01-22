import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import * as reactRedux from 'react-redux';
import { brokerInformationSliceActions } from 'modules/broker-signup-direct/src/application/features/brokerInformation/BrokerInformationSlice';
import RegisterBrokerApi from '../../../application/features/RegisterBroker/RegisterBrokerApi';
import { store } from '../../../config/store';
import { BrokerEmail } from './BrokerEmail';
import { VALIDATION_MESSAGES } from '../../../constants/validationMessages';
import { responsibleInformationSliceActions } from '../../../application/features/responsibleInformation/ResponsibleInformationSlice';

describe('BrokerEmail', () => {
  const historyMock = jest.fn();
  const useDispatchMock = jest.spyOn(reactRedux, 'useDispatch');

  const props = {
    history: {
      push: historyMock as any,
    } as any,
    location: {} as any,
    match: {} as any,
    onSubmit: {
      push: historyMock as any,
    } as any,
    isSubmitting: false,
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

  afterEach(() => {
    store.dispatch(
      responsibleInformationSliceActions.resetResponsibleInformationSlice(),
    );
  });

  beforeEach(() => {
    useDispatchMock.mockClear();
  });

  it('should render successfully', () => {
    const { baseElement } = render(
      <Provider store={store}>
        <BrokerEmail {...props} />
      </Provider>,
    );
    expect(baseElement).toBeTruthy();
  });

  it('should render successfully and change inputs', async () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <BrokerEmail {...props} />
      </Provider>,
    );
    store.dispatch(
      responsibleInformationSliceActions.setEmail('teste@teste.com'),
    );

    const spyCheckEmailExists = jest
      .spyOn(RegisterBrokerApi, 'checkEmailExists')
      .mockImplementation(() => Promise.resolve(''));

    const inputName = getByTestId('responsible-name');
    const inputEmail = getByTestId('responsible-email');
    const check = getByTestId('chk-select-all');
    const button = getByTestId('button-responsible-information-registry');

    await act(async () => {
      fireEvent.change(inputName, { target: { value: 'teste teste' } });
      fireEvent.change(inputEmail, { target: { value: 'teste@teste.com' } });
      fireEvent.blur(inputEmail);
      fireEvent.click(check);
    });
    await spyCheckEmailExists;

    expect(inputName).toHaveValue('teste teste');
    expect(inputEmail).toHaveValue('teste@teste.com');
    expect(spyCheckEmailExists).toBeCalled();
    expect(button).toBeEnabled();
  });

  it('should render successfully with error invalid errors', async () => {
    const { getByTestId, getByText } = render(
      <Provider store={store}>
        <BrokerEmail {...props} />
      </Provider>,
    );

    const inputName = getByTestId('responsible-name');
    const inputEmail = getByTestId('responsible-email');
    const button = getByTestId('button-responsible-information-registry');

    await act(async () => {
      fireEvent.change(inputName, { target: { value: 't' } });
      fireEvent.blur(inputName);
      fireEvent.change(inputEmail, { target: { value: 'teste' } });
      fireEvent.blur(inputEmail);
    });

    expect(getByText(VALIDATION_MESSAGES.nameResponsible)).toBeInTheDocument();
    expect(
      getByText('O preenchimento deste campo é obrigatório'),
    ).toBeInTheDocument();
    expect(button).toBeDisabled();
  });

  it('Should go to privacy policy page on privacy policy button click', async () => {
    const baseElement = render(
      <Provider store={store}>
        <BrokerEmail {...props} />
      </Provider>,
    );
    useDispatchMock.mockImplementation(() => historyMock);

    const btn = baseElement.getByTestId('privacy-policy-button');
    await act(async () => {
      await fireEvent.click(btn);
    });

    expect(window.location.assign).toHaveBeenCalledWith(
      `${process.env.NX_GLOBAL_SITE_JUNTO}/politica-privacidade/`,
    );
  });
});
