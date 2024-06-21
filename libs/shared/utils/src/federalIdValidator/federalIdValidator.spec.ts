import { federalIdValidator } from './federalIdValidator';

describe('Federal Id Validator Lib', () => {
  it('If validation type is PARTIAL should return true if value has only digits and allowed chars', () => {
    const result = federalIdValidator('01.001/0001-', 'partial');
    expect(result).toBeTruthy();
  });

  it('If validation type is PARTIAL should return false if value has an letter', () => {
    const result = federalIdValidator('01.001/0001-a', 'partial');
    expect(result).toBeFalsy();
  });

  it('If validation type is PARTIAL should return false if value has an special character other than dot, dash and forward slash', () => {
    const result = federalIdValidator('01.001/0001!', 'partial');
    expect(result).toBeFalsy();
  });

  it('If validation type is FULL, should return true if value is a valid federalId with only digits', () => {
    const result = federalIdValidator('85182056000167', 'full');
    expect(result).toBeTruthy();
  });

  it('If validation type is FULL, should return true if value is a valid federalId with correct format', () => {
    const result = federalIdValidator('85.182.056/0001-67', 'full');
    expect(result).toBeTruthy();
  });

  it('If validation type is FULL, should return false if value is a string with only digits and not 14 characters', () => {
    const result = federalIdValidator('851820560001678', 'full');
    expect(result).toBeFalsy();
  });

  it('If validation type is FULL, should return false if value is a string with incorrect format', () => {
    const result = federalIdValidator('85-182-056/0001-67', 'full');
    expect(result).toBeFalsy();
  });

  it('If validation type is FULL, should return false if value is a string with invalid characters', () => {
    const result = federalIdValidator('85.182.056/0001-67!', 'full');
    expect(result).toBeFalsy();
  });

  it('If validation type is FULL, should return false if value is a invalid federalId', () => {
    const result = federalIdValidator('01.001.001/0001-01', 'full');
    expect(result).toBeFalsy();
  });
});
