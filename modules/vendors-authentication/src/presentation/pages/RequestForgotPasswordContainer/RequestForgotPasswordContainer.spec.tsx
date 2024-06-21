import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import RequestForgotPassword from './RequestForgotPasswordContainer';


describe('RequestForgotPasswordContainer component', () => {
  it('should render successfully', () => {

    const { baseElement, getByText } = render(<RequestForgotPassword />)

    expect(baseElement).toBeTruthy();
    expect(getByText('Confirme seu e-mail para recuperar seu acesso.')).toBeInTheDocument();
  });
});
