import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { act } from 'react-dom/test-utils';
import FirstAccessForm from './FirstAccessForm';
import TermsApi from '../../../application/features/terms/TermsApi';
import AuthApi from '../../../application/features/auth/AuthApi';
import { TermsMock, UserTokenMock } from '../../../__mocks__/index';

describe('FirstAccessForm', () => {
  jest.spyOn(TermsApi, 'getAcceptTerms').mockImplementation(async () => {
    return TermsMock;
  });

  jest.spyOn(TermsApi, 'getTerm').mockImplementation(async () => {
    return 'texto mock';
  });

  jest.spyOn(TermsApi, 'postAccept').mockImplementation(async () => {
    return '';
  });

  jest.spyOn(AuthApi, 'resetPassword').mockImplementation(async () => {
    return UserTokenMock as any;
  });

  jest.spyOn(AuthApi, 'postAuth').mockImplementation(async () => {
    return UserTokenMock as any;
  });

  it('should render successfully', () => {
    const { baseElement } = render(
      <FirstAccessForm
        hash="698dc19d489c4e4db73e28a713eab07b"
        token="698dc19d489c4e4db73e28a713eab07b"
        title="Para sua segurança, precisamos que você defina uma senha."
        isFiristAccess
      />,
    );
    expect(baseElement).toBeTruthy();
  });

  it('should render successfully and change inputs', async () => {
    const { getByTestId } = render(
      <FirstAccessForm
        hash="698dc19d489c4e4db73e28a713eab07b"
        token="698dc19d489c4e4db73e28a713eab07b"
        title="Para sua segurança, precisamos que você defina uma senha."
        isFiristAccess
      />,
    );

    const inputPassword = getByTestId('first_access-input-password');
    const inputConfirmPassword = getByTestId(
      'first_access-input-confirmPassword',
    );
    const check = getByTestId('first_access-checkbox-TermsResponsibility');
    const button = getByTestId('first_access-button-finish');

    await act(async () => {
      fireEvent.change(inputPassword, { target: { value: 'Parana.1a2b3c' } });
      fireEvent.change(inputConfirmPassword, {
        target: { value: 'Parana.1a2b3c' },
      });
      fireEvent.click(check);
    });

    expect(inputPassword).toHaveValue('Parana.1a2b3c');
    expect(inputConfirmPassword).toHaveValue('Parana.1a2b3c');
    expect(button).toBeEnabled();
  });

  it('should render successfully and change inputs but button disabled', async () => {
    const { getByTestId } = render(
      <FirstAccessForm
        hash="698dc19d489c4e4db73e28a713eab07b"
        token="698dc19d489c4e4db73e28a713eab07b"
        title="Para sua segurança, precisamos que você defina uma senha."
        isFiristAccess
      />,
    );

    const inputPassword = getByTestId('first_access-input-password');
    const inputConfirmPassword = getByTestId(
      'first_access-input-confirmPassword',
    );
    const button = getByTestId('first_access-button-finish');

    await act(async () => {
      fireEvent.change(inputPassword, { target: { value: 'Parana' } });
      fireEvent.change(inputConfirmPassword, { target: { value: 'Parana' } });
    });

    expect(inputPassword).toHaveValue('Parana');
    expect(inputConfirmPassword).toHaveValue('Parana');
    expect(button).toBeDisabled();
  });

  it('should render successfully and handle submmit', async () => {
    const { getByTestId } = render(
      <FirstAccessForm
        hash="698dc19d489c4e4db73e28a713eab07b"
        token="698dc19d489c4e4db73e28a713eab07b"
        title="Para sua segurança, precisamos que você defina uma senha."
        isFiristAccess
      />,
    );

    const inputPassword = getByTestId('first_access-input-password');
    const inputConfirmPassword = getByTestId(
      'first_access-input-confirmPassword',
    );
    const check = getByTestId('first_access-checkbox-TermsResponsibility');
    const button = getByTestId('first_access-button-finish');

    await act(async () => {
      fireEvent.change(inputPassword, { target: { value: 'Parana.1a2b3c' } });
      fireEvent.change(inputConfirmPassword, {
        target: { value: 'Parana.1a2b3c' },
      });
      fireEvent.click(check);
    });

    fireEvent.click(button);

    expect(inputPassword).toHaveValue('Parana.1a2b3c');
    expect(inputConfirmPassword).toHaveValue('Parana.1a2b3c');
    expect(check).toBeTruthy();
  });
});
