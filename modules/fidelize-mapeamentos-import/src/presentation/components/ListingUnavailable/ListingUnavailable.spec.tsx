import { render } from '@testing-library/react';
import ListingUnavailable from './ListingUnavailable';

describe('ListingUnavailable', () => {
  it('Should render successfully', () => {
    const { getByText } = render(<ListingUnavailable />);
    expect(getByText('Lista indisponível')).toBeTruthy();
    expect(
      getByText(
        'Esta lista não está disponível no momento. Em breve você conseguirá acessá-la.',
      ),
    ).toBeTruthy();
  });
});
