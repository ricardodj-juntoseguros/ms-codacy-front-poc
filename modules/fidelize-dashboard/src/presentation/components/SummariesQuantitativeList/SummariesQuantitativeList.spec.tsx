import '@testing-library/jest-dom';
import { SummariesQuantitativeByPolicyholderDTO } from 'modules/fidelize-dashboard/src/application/types/dto/SummariesQuantitativeByPolicyholderDTO';
import { render } from '../../../config/testUtils';
import SummariesQuantitativeList from './SummariesQuantitativeList';

describe('SummariesQuantitativeList', () => {
  const mockSummaries = [
    {
      companyName: 'CONSTRUTORA SAO JUDAS TADEU LTDA',
      federalId: '30540454000116',
      processesFound: {
        total: 130,
        federal: 100,
        labor: 30,
      },
    },
  ] as SummariesQuantitativeByPolicyholderDTO[];

  it('Should estimative process ative', () => {
    const { getByText } = render(
      <SummariesQuantitativeList loading={false} summaries={mockSummaries} />,
    );
    expect(getByText('CONSTRUTORA SAO JUDAS TADEU LTDA')).toBeInTheDocument();
    expect(getByText('Trabalhistas')).toBeInTheDocument();
    expect(getByText('Federais e Estaduais')).toBeInTheDocument();
    expect(
      getByText('Boa escolha! Parece relevante mapear o tomador.'),
    ).toBeInTheDocument();
  });
});
