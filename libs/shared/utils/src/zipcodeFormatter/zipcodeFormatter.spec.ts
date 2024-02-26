import { zipcodeFormatter } from './zipcodeFormatter';

describe('Zipcode Formatter', () => {
  it('Should format a number string into a zipcode format accordingly', () => {
    const result = zipcodeFormatter('88888888');
    expect(result).toBe('88888-888');
  });
});
