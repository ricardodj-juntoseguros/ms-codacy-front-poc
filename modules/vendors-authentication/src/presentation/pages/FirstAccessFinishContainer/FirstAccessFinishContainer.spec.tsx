import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import  FirstAccessFinishContainer  from './FirstAccessFinishContainer';


describe('FirstAccessContainer component', () => {
  it('should render successfully', () => {

    const { baseElement, getByText } = render(<FirstAccessFinishContainer />)

    expect(baseElement).toBeTruthy();
    expect(getByText('Senha criada com sucesso. A partir de agora você poderá visualizar todas as oportunidades Vendors.')).toBeInTheDocument();
  });
});
