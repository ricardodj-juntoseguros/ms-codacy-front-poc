import { inputNoAcceptLetters } from './inputNoAcceptLetters';

describe('inputNoAcceptLetters', () => {
  it('must remove letter from the input string', () => {
    const inputValueWithLetters = '123a';
    const result = inputNoAcceptLetters(inputValueWithLetters);

    expect(result).toEqual('123');
  });

  it('must keep only numbers in the input string', () => {
    const inputValueOnlyNumbers = '456';
    const result = inputNoAcceptLetters(inputValueOnlyNumbers);

    expect(result).toEqual(inputValueOnlyNumbers);
  });

  it('must return an empty string if input is falsy', () => {
    const resultEmptyString = inputNoAcceptLetters('');

    expect(resultEmptyString).toEqual('');
  });
});
