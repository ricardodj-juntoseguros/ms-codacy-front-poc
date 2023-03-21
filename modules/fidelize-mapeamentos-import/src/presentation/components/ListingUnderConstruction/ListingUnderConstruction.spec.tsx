import { render } from '@testing-library/react';
import ListingUnderConstruction from './ListingUnderConstruction';

describe('ListingUnderConstruction', () => {
  it('Should render successfully', () => {
    const { getByText } = render(<ListingUnderConstruction />);
    expect(getByText('Listagem em construção')).toBeTruthy();
    expect(
      getByText(
        'Estamos trabalhando no desenvolvimento dessa lista. Em breve disponibilizaremos ela para você!',
      ),
    ).toBeTruthy();
  });
});
