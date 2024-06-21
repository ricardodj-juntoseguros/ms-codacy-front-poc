import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import  ForgotPasswordFinishContainer  from './ForgotPasswordFinishContainer';


describe('ForgotPasswordFinishContainer component', () => {
  it('should render successfully', () => {

    const { baseElement, getByText } = render(<ForgotPasswordFinishContainer />)

    expect(baseElement).toBeTruthy();
    expect(getByText('Senha alterada com sucesso.')).toBeInTheDocument();
  });
});
