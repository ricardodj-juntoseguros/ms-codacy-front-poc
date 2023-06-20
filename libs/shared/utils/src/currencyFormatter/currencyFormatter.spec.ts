import { currencyFormatter } from './currencyFormatter';

describe('currencyFormatter', () => {
  it('should format a number to currency pattern', () => {
    const value = currencyFormatter(800);

    expect(value).toEqual('R$ 800,00');
  });
});
