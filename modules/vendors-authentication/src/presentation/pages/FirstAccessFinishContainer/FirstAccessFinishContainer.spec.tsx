import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import Router from 'react-router';
import  FirstAccessFinishContainer  from './FirstAccessFinishContainer';

describe('FirstAccessContainer component', () => {
  it('should render successfully', () => {
    jest.spyOn(Router, 'useParams').mockReturnValue({ proposalId: '1', guid:'u823jf98v20v0n' });
    const { baseElement, getByText } = render(<FirstAccessFinishContainer />)

    expect(baseElement).toBeTruthy();
    expect(getByText('Senha criada com sucesso. A partir de agora você poderá visualizar todas as oportunidades Vendors.')).toBeInTheDocument();
  });
});
