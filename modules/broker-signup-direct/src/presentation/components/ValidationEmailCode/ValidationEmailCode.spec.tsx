import { render, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { store } from '../../../config/store';
import { ValidationEmailCode } from './ValidationEmailCode';
import RegisterBrokerApi from '../../../application/features/RegisterBroker/RegisterBrokerApi';

describe('ValidationEmailCode', () => {
  const codeIsValid = false;
  const codeIsComplet = false;
  const setCodeIsValid = jest.fn();
  const setCodeIsComplet = jest.fn();

  it('should render successfully', () => {
    const { baseElement } = render(
      <Provider store={store}>
        <ValidationEmailCode
          userPath="41a5ecaa-bd94-47bc-b352-845fdf665a10"
          codeIsValid={codeIsValid}
          onSetCodeIsValid={setCodeIsValid}
          codeIsComplet={codeIsComplet}
          onSetCodeIsComplet={setCodeIsComplet}
        />
      </Provider>,
    );
    expect(baseElement).toBeTruthy();
  });

  it('should render successfully with button enabled', async () => {
    const GetValidationCodeEmailMockApi = jest
      .spyOn(RegisterBrokerApi, 'GetValidationCodeEmail')
      .mockImplementation(() => Promise.resolve(true));

    const { getByTestId } = render(
      <Provider store={store}>
        <ValidationEmailCode
          userPath="41a5ecaa-bd94-47bc-b352-845fdf665a10"
          codeIsValid={codeIsValid}
          onSetCodeIsValid={setCodeIsValid}
          codeIsComplet={codeIsComplet}
          onSetCodeIsComplet={setCodeIsComplet}
        />
      </Provider>,
    );

    const inputFirstNumber = getByTestId('broker-FirstNumber');
    const inputSecondNumber = getByTestId('broker-SecondNumber');
    const inputThirdNumber = getByTestId('broker-ThirdNumber');
    const inputFourthNumber = getByTestId('broker-FourthNumber');

    await act(async () => {
      fireEvent.change(inputFirstNumber, { target: { value: '1' } });
      fireEvent.change(inputSecondNumber, { target: { value: '2' } });
      fireEvent.change(inputThirdNumber, { target: { value: '3' } });
      fireEvent.change(inputFourthNumber, { target: { value: '4' } });
    });

    await GetValidationCodeEmailMockApi;

    expect(GetValidationCodeEmailMockApi).toBeCalled();
  });
});
