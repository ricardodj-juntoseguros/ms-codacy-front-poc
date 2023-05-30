import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import  LoginContainer  from './LoginContainer';


describe('LoginContainer component', () => {
  it('should render successfully', () => {

    const { baseElement, getByText } = render(<LoginContainer />)

    expect(baseElement).toBeTruthy();
    expect(getByText('Seja bem-vindo. Faça seu login para continuar.')).toBeInTheDocument();
  });
});
