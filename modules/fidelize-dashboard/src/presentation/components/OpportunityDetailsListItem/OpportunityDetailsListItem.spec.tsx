import { render } from '@testing-library/react';
import OpportunityDetailsListItem from '.';

describe('Opportunity Details List Item', () => {
  it('Should render accordingly to props', () => {
    const { getByText } = render(
      <OpportunityDetailsListItem
        type="Renovação"
        expiration="2026-01-01T10:00:00.000Z"
        mappingDate="2022-01-01T10:00:00.000Z"
        policyholder="Teste Tomador"
        securityAmount={2550650.5}
      />,
    );
    expect(getByText('Renovação')).toBeTruthy();
    expect(getByText('Com vencimento em 01/jan/26')).toBeTruthy();
    expect(getByText('2.550.650,50')).toBeTruthy();
    expect(getByText('Teste Tomador')).toBeTruthy();
    expect(getByText('01/jan/22')).toBeTruthy();
  });

  it('Should render "Prazo indeterminado" label if expiration is null', () => {
    const { getByText } = render(
      <OpportunityDetailsListItem
        type="Renovação"
        expiration={null}
        mappingDate="2022-01-01T10:00:00.000Z"
        policyholder="Teste Tomador"
        securityAmount={2550650.5}
      />,
    );
    expect(getByText('Prazo indeterminado')).toBeTruthy();
  });

  it('Should render expired message if expiration is before today', () => {
    const { getByText } = render(
      <OpportunityDetailsListItem
        type="Renovação"
        expiration="2022-02-01T10:00:00.000Z"
        mappingDate="2022-01-01T10:00:00.000Z"
        policyholder="Teste Tomador"
        securityAmount={2550650.5}
      />,
    );
    expect(getByText('Expirada em 01/fev/22')).toBeTruthy();
  });
});
