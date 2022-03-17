import { render } from '@testing-library/react';
import OpportunityDetailsListHeader from '.';

describe('Opportunity Details List Header', () => {
  it('Should render successfully', () => {
    const { getByText } = render(<OpportunityDetailsListHeader />);
    expect(getByText('TIPO/OBS.')).toBeTruthy();
    expect(getByText('VALOR IS')).toBeTruthy();
    expect(getByText('TOMADOR')).toBeTruthy();
    expect(getByText('DT MAPEAMENTO')).toBeTruthy();
  });
});
