import { currencyFormatter } from './currencyFormatter';

describe('currencyFormatter helper', () => {
  it('should format the value correctly', () => {
    const value = 1234.56;
    const result = currencyFormatter(value);
    expect(result).toEqual('R$ 1.234,56');
  });
});
