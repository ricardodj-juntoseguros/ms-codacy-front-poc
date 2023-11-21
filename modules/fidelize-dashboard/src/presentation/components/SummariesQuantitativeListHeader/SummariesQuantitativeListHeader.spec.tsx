import '@testing-library/jest-dom';
import { render } from '../../../config/testUtils';
import SummariesQuantitativeListHeader from './SummariesQuantitativeListHeader';

describe('SummariesQuantitativeListHeader', () => {
  it('Should render all columns correctly', () => {
    const { getByText } = render(<SummariesQuantitativeListHeader />);
    expect(getByText('TOMADOR')).toBeInTheDocument();
    expect(getByText('PROCESSOS ESTIMADOS')).toBeInTheDocument();
    expect(getByText('RESULTADO DA ANÁLISE')).toBeInTheDocument();
  });
});
