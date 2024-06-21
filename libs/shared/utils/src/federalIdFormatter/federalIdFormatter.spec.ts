import { federalIdFormatter } from './federalIdFormatter';

describe('Federal Id Formatter', () => {
  it('Should format a federalId string correctly', () => {
    const actual = federalIdFormatter('11223344556677');
    expect(actual).toBe('11.223.344/5566-77');
  });

  it('Should return empty string if argument is empty', () => {
    const actual = federalIdFormatter('');
    expect(actual).toBe('');
  });
});
