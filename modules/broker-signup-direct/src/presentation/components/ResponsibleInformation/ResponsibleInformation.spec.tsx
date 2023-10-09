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
    const inputEmail = getByTestId('responsible-email');
    const check = getByTestId('chk-select-all');
    const button = getByTestId('button-responsible-information-registry')

    await act(async () => {
      fireEvent.change(inputName, { target: { value: 'teste teste' } });
      fireEvent.change(inputEmail, { target: { value: 'teste@teste.com' } });
      fireEvent.click(check);
    });

    expect(inputName).toHaveValue('teste teste');
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
   const inputEmail = getByTestId('responsible-email');
   const button = getByTestId('button-responsible-information-registry')

   await act(async () => {
     fireEvent.change(inputName, { target: { value: 't' } });
     fireEvent.blur(inputName);
     fireEvent.change(inputEmail, { target: { value: 'teste' } });
     fireEvent.blur(inputEmail);
   });

    expect(getByText(VALIDATION_MESSAGES.nameResponsible)).toBeInTheDocument();
    expect(getByText(VALIDATION_MESSAGES.email)).toBeInTheDocument();
    expect(button).toBeDisabled();

  });
});
