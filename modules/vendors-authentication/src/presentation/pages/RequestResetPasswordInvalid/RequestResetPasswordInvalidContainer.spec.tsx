import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import  RequestResetPasswordInvalid  from './RequestResetPasswordInvalidContainer';


describe('RequestForgotPasswordFinishContainer component', () => {
  it('should render successfully', () => {

    const { baseElement, getByText } = render(<RequestResetPasswordInvalid />)

    expect(baseElement).toBeTruthy();
    expect(getByText('Infelizmente este link expirou. Precisamos que você solicite um novo link para criar seu acesso ou redefinir sua senha. Em caso de dúvidas, entre em contato pelo e-mail')).toBeInTheDocument();
  });
});
