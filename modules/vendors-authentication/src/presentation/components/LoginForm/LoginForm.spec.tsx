import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { act } from 'react-dom/test-utils';
import { LoginForm} from './LoginForm';

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
});
