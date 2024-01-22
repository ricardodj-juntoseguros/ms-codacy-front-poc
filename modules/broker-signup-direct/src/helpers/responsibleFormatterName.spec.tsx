import { responsibleFormatterName } from './responsibleFormatterName';

describe('responsibleFormatterName', () => {
  it('must remove digit from input string', () => {
    const inputValueWithDigits = 'JohnDoe1';
    const result = responsibleFormatterName(inputValueWithDigits);

    expect(result).toEqual('JohnDoe');
  });

  it('must keep the input string if there are no digits', () => {
    const inputValueWithoutDigits = 'JohnDoe';
    const result = responsibleFormatterName(inputValueWithoutDigits);

    expect(result).toEqual(inputValueWithoutDigits);
  });

  it('must return an empty string if input is falsy', () => {
    const resultEmptyString = responsibleFormatterName('');

    expect(resultEmptyString).toEqual('');
  });
});
