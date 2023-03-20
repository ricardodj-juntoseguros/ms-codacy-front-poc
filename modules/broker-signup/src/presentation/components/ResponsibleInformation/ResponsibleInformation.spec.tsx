import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import { store } from '../../../config/store';
import { ResponsibleInformation} from './ResponsibleInformation';
import { VALIDATION_MESSAGES } from '../../../constants/validationMessages';
import {
  responsibleInformationSliceActions
} from '../../../application/features/responsibleInformation/ResponsibleInformationSlice';


describe('ResponsibleInformation', () => {
  const historyMock = jest.fn();

  const props = {
    onSubmit: {
      push: historyMock as any,
    } as any,
  };

  afterEach(() => {
    store.dispatch(responsibleInformationSliceActions.resetResponsibleInformationSlice());
  });

  it('should render successfully', () => {
    const { baseElement } = render(
      <Provider store={store}>
        <ResponsibleInformation {...props} />
      </Provider>
    );
    expect(baseElement).toBeTruthy();
  });

  it('should render successfully and change inputs',  async () => {
    const { getByTestId } = render(
       <Provider store={store}>
          <ResponsibleInformation {...props} />
       </Provider>
    );

    const inputName = getByTestId('responsible-name');
    const inputCpf = getByTestId('responsible-cpf');
    const inputPhone = getByTestId('responsible-phone');
    const inputEmail = getByTestId('responsible-email');
    const check = getByTestId('chk-select-all');
    const button = getByTestId('button-responsible-information-registry')

    await act(async () => {
      fireEvent.change(inputName, { target: { value: 'teste teste' } });
      fireEvent.change(inputCpf, { target: { value: '9999999999' } });
      fireEvent.change(inputPhone, { target: { value: '4199999999' } });
      fireEvent.change(inputEmail, { target: { value: 'teste@teste.com' } });
      fireEvent.click(check);
    });

    expect(inputName).toHaveValue('teste teste');
    expect(inputCpf).toHaveValue('9999999999');
    expect(inputPhone).toHaveValue('(41) 9999-9999');
    expect(inputEmail).toHaveValue('teste@teste.com');
    expect(button).toBeEnabled();
    });

  it('should render successfully with error invalid errors',  async () => {
    const { getByTestId,getByText } = render(
      <Provider store={store}>
        <ResponsibleInformation {...props} />
      </Provider>
   );

   const inputName = getByTestId('responsible-name');
   const inputCpf = getByTestId('responsible-cpf');
   const inputPhone = getByTestId('responsible-phone');
   const inputEmail = getByTestId('responsible-email');
   const button = getByTestId('button-responsible-information-registry')

   await act(async () => {
     fireEvent.change(inputName, { target: { value: 't' } });
     fireEvent.blur(inputName);
     fireEvent.change(inputCpf, { target: { value: '99999999' } });
     fireEvent.blur(inputCpf);
     fireEvent.change(inputPhone, { target: { value: '49999999' } });
     fireEvent.blur(inputPhone);
     fireEvent.change(inputEmail, { target: { value: 'teste' } });
     fireEvent.blur(inputEmail);
   });

    expect(getByText(VALIDATION_MESSAGES.nameResponsible)).toBeInTheDocument();
    expect(getByText(VALIDATION_MESSAGES.documentNumber)).toBeInTheDocument();
    expect(getByText(VALIDATION_MESSAGES.email)).toBeInTheDocument();
    expect(getByText(VALIDATION_MESSAGES.phone)).toBeInTheDocument();
    expect(button).toBeDisabled();

  });
});
