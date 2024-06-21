import { stringToInt } from './stringToInt';

describe('StringToInt', () => {
  it('Should convert a numeric string to a int number correctly', () => {
    const result = stringToInt('12000');
    expect(result).toStrictEqual(12000);
  });
});
