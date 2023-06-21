import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import  RequestForgotPasswordFinishContainer  from './RequestForgotPasswordFinishContainer';


describe('RequestForgotPasswordFinishContainer component', () => {
  it('should render successfully', () => {

    const { baseElement, getByText } = render(<RequestForgotPasswordFinishContainer />)

    expect(baseElement).toBeTruthy();
    expect(getByText('Pronto! Se o e-mail informado estiver cadastrado, você receberá instruções para recuperar seu acesso.')).toBeInTheDocument();
  });
});
