import { cpfFormatter } from './cpfFormatter';

describe('Cpf Formatter', () => {
  it('Should format a federalId string correctly', () => {
    const actual = cpfFormatter('12470058744');
    expect(actual).toBe('124.700.587-44');
  });

  it('Should return empty string if argument is empty', () => {
    const actual = cpfFormatter('');
    expect(actual).toBe('');
  });
});
