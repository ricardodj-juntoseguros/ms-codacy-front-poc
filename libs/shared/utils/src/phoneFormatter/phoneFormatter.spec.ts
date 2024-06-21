import { phoneFormatter } from './phoneFormatter';

describe('Phone Formatter', () => {
  it('Should format a phone string correctly', () => {
    const actual = phoneFormatter('41999999999');
    expect(actual).toBe('(41) 99999-9999');
  });

  it('Should format a phone string correctly', () => {
    const actual = phoneFormatter('4133333333');
    expect(actual).toBe('(41) 3333-3333');
  });

  it('Should return empty string if argument is empty', () => {
    const actual = phoneFormatter('');
    expect(actual).toBe('');
  });
});
