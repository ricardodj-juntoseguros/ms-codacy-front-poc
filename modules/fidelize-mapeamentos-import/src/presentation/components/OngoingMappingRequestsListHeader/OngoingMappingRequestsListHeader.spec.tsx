import '@testing-library/jest-dom';
import { render } from '../../../config/testUtils';
import OngoingMappingRequestsListHeader from './OngoingMappingRequestsListHeader';

describe('OngoingMappingRequestsListHeader', () => {
  it('Should render all columns correctly', () => {
    const { getByText } = render(<OngoingMappingRequestsListHeader />);
    expect(getByText('Solicitado Em')).toBeInTheDocument();
    expect(getByText('Tomador/Grupo')).toBeInTheDocument();
    expect(getByText('Corretora/Categoria')).toBeInTheDocument();
    expect(getByText('Trab.')).toBeInTheDocument();
    expect(getByText('Fed.')).toBeInTheDocument();
    expect(getByText('Est.')).toBeInTheDocument();
    expect(getByText('DA')).toBeInTheDocument();
    expect(getByText('CARF')).toBeInTheDocument();
    expect(getByText('Status')).toBeInTheDocument();
  });
});
