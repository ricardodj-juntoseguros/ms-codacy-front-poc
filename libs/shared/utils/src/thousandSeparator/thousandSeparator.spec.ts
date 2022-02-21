import { thousandSeparator } from './thousandSeparator';

describe('Thousand Separator Lib', () => {
  it('Should separate number in thousands', () => {
    const result = thousandSeparator(120000);
    expect(result).toBe('120.000');
  });

  it('Should separate number with provided separator argument', () => {
    const result = thousandSeparator(120100255, '@');
    expect(result).toBe('120@100@255');
  });

  it('Should return null if provided value is null', () => {
    const result = thousandSeparator(null);
    expect(result).toBe(null);
  });
});
