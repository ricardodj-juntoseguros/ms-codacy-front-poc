import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { act } from 'react-dom/test-utils';
import { LoginForm} from './LoginForm';
import  AuthApi from '../../../application/features/auth/AuthApi'
import { UserTokenMock } from '../../../__mocks__/index';

describe('LoginForm', () => {

  it('should render successfully', () => {
    const { baseElement } = render( <LoginForm /> );
    expect(baseElement).toBeTruthy();
  });

  it('should render successfully and change inputs',  async () => {
    const { getByTestId } = render( <LoginForm /> );

    const inputLogin= getByTestId('loginForm-input-login');
    const inputPassword = getByTestId('loginForm-input-password');

    await act(async () => {
      fireEvent.change(inputLogin, { target: { value: 'teste' } });
      fireEvent.change(inputPassword, { target: { value: 'teste321' } });
    });

    expect(inputLogin).toHaveValue('teste');
    expect(inputPassword).toHaveValue('teste321');
    });

    it('should render successfully and handleSubmit ',  async () => {

      const AuthMock=  jest
      .spyOn(AuthApi, 'postAuth')
      .mockImplementation(async () => {
        return UserTokenMock as any;
      });


      const { getByTestId } = render( <LoginForm /> );

      const inputLogin= getByTestId('loginForm-input-login');
      const inputPassword = getByTestId('loginForm-input-password');
      const button = getByTestId('loginForm-buttom-login')

      await act(async () => {
        fireEvent.change(inputLogin, { target: { value: 'teste' } });
        fireEvent.change(inputPassword, { target: { value: 'teste321' } });
      });

      fireEvent.click(button);

      expect(AuthMock).toHaveBeenCalled()
      });
});
