import { thousandTextFormatter } from './thousandTextFormatter';

describe('Thousand Text Formatter', () => {
  it('Should format a number in full text accordingly', () => {
    const result = thousandTextFormatter(225800000);
    expect(result).toBe('225,8 milhões');
  });

  it('Should use preffix and suffix if provided', () => {
    const result = thousandTextFormatter(562000, 'R$ ', ' aproximado');
    expect(result).toBe('R$ 562 mil aproximado');
  });

  it('Should return same number if is lesser than 1000', () => {
    const result = thousandTextFormatter(650);
    expect(result).toBe('650');
  });
});
