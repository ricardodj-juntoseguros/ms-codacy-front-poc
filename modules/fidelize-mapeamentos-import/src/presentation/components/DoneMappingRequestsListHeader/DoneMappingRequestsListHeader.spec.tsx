import '@testing-library/jest-dom';
import { render } from '../../../config/testUtils';
import DoneMappingRequestsListHeader from './DoneMappingRequestsListHeader';

describe('DoneMappingRequestsListHeader', () => {
  it('Should render all columns correctly', () => {
    const { getByText } = render(<DoneMappingRequestsListHeader />);
    expect(getByText('Mapeado Em')).toBeInTheDocument();
    expect(getByText('Tomador/Grupo')).toBeInTheDocument();
    expect(getByText('Corretora/Categoria')).toBeInTheDocument();
    expect(getByText('Total de Processos')).toBeInTheDocument();
    expect(getByText('Processos Abertos')).toBeInTheDocument();
    expect(getByText('Oportunidades')).toBeInTheDocument();
  });
});
