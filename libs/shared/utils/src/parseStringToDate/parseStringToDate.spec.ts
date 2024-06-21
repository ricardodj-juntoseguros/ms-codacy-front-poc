import { parseStringToDate } from './parseStringToDate';

describe('Parse String to  Date', () => {
  it('Should parse string to date correctly', () => {
    const result = parseStringToDate('14/06/2023');
    expect(result).toEqual(new Date('2023/06/14'));
  });
});
